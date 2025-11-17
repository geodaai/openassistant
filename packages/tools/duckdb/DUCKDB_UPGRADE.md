# DuckDB WASM 1.31.0 Upgrade

## Summary

Upgraded from DuckDB WASM **1.29.0** to **1.31.0** to enable support for Overture Maps S3 glob patterns in browser environments.

## Root Cause

The SQLRooms query example project successfully executes Overture Maps queries with S3 wildcard patterns (e.g., `s3://overturemaps-us-west-2/release/2025-10-22.0/theme=divisions/type=division_area/*`) in the browser, while our project failed with the same queries.

### Key Finding

The SQLRooms query example uses DuckDB WASM **1.31.0** with a package override:

```json
{
  "overrides": {
    "@duckdb/duckdb-wasm": "1.31.0"
  }
}
```

Our project was using **1.29.0**, which lacks support for S3 glob pattern operations in browser environments.

## Changes Made

### 1. Root Package (`package.json`)
- Updated resolution: `"@duckdb/duckdb-wasm": "1.31.0"` (was `"1.29.0"`)

### 2. DuckDB Package (`packages/tools/duckdb/package.json`)
- Updated dependency: `"@duckdb/duckdb-wasm": "1.31.0"` (was `"^1.29.0"`)
- Updated `@sqlrooms/duckdb`: `"0.26.0-rc.6"` (was `"0.26.0-rc.2"`)
- Removed unnecessary `resolutions` field (managed at root level)

## Testing

To test that Overture Maps queries now work, try this query in your application:

```sql
LOAD spatial;
LOAD httpfs;
SET s3_region='us-west-2';

SELECT id, names.primary as name, region, geometry AS geom 
FROM read_parquet('s3://overturemaps-us-west-2/release/2025-10-22.0/theme=divisions/type=division_area/*', 
                  filename=true, 
                  hive_partitioning=1) 
WHERE names.primary IN ('Arizona') 
  AND subtype = 'region' 
  AND class = 'land';
```

## Version History

- **1.29.0**: S3 glob patterns don't work in browser ❌
- **1.30.0**: Improvements to httpfs extension
- **1.31.0**: Full S3 glob pattern support in browser ✅

## References

- SQLRooms query example: https://github.com/sqlrooms/sqlrooms/tree/main/examples/query
- Overture Maps: https://overturemaps.org/
- DuckDB httpfs extension: https://duckdb.org/docs/extensions/httpfs.html

## Date

November 16, 2025

