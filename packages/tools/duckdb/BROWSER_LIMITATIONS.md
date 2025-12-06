# DuckDB WASM Version Requirements for Overture Maps

## Update (November 16, 2025)

**The S3 glob pattern issue has been resolved!** 

The problem was **NOT a fundamental browser limitation**, but rather a **version compatibility issue**. DuckDB WASM 1.31.0 added full support for S3 glob patterns in browser environments.

## Original Error

```
HEAD and GET requests failed: s3://overturemaps-us-west-2/release/2025-10-22.0/theme=divisions/type=division_area/*
```

## Root Cause

The error was caused by using **DuckDB WASM 1.29.0**, which lacked proper support for S3 glob pattern operations in the browser. Version 1.31.0 resolved this issue.

## Solution

Upgrade to **DuckDB WASM 1.31.0** or later. This has been completed in this project.

See [DUCKDB_UPGRADE.md](./DUCKDB_UPGRADE.md) for details.

## Version Compatibility

| DuckDB WASM Version | S3 Glob Patterns in Browser | Notes |
|---------------------|------------------------------|-------|
| 1.29.0 | ❌ Not Supported | Returns "HEAD and GET requests failed" error |
| 1.30.0 | ⚠️ Partial | Improved httpfs, but incomplete S3 glob support |
| 1.31.0 | ✅ Fully Supported | Complete S3 glob pattern support in browser |

## Working Example

The following query now works correctly in the browser with DuckDB WASM 1.31.0:

```sql
LOAD spatial;
LOAD httpfs;
SET s3_region='us-west-2';

SELECT id, names.primary as name, region, geometry AS geom 
FROM read_parquet('s3://overturemaps-us-west-2/release/2025-10-22.0/theme=divisions/type=division_area/*', 
                  filename=true, 
                  hive_partitioning=1) 
WHERE names.primary IN ('Arizona', 'California', 'Texas') 
  AND subtype = 'region' 
  AND class = 'land';
```

## Verification

Verified working in:
- ✅ SQLRooms query example (uses DuckDB WASM 1.31.0)
- ✅ OpenAssistant project (upgraded to 1.31.0)

## Requirements for S3 Access

When querying S3 data in the browser with DuckDB WASM 1.31.0+:

1. **Load Extensions**: Both `httpfs` and `spatial` extensions must be loaded
2. **Set Region**: Use `SET s3_region='us-west-2'` for Overture Maps
3. **Public Buckets Only**: The S3 bucket must be publicly accessible (Overture Maps is public)
4. **CORS Not Required**: Unlike typical browser S3 access, DuckDB's httpfs handles this internally

## Benefits of Browser-Based DuckDB

With DuckDB WASM 1.31.0, you can now:

- ✅ Query large-scale Overture Maps data directly from S3
- ✅ Use glob patterns for partitioned data
- ✅ Process geospatial data entirely client-side
- ✅ No server infrastructure needed
- ✅ Fast, efficient parallel data loading

## References

- [SQLRooms Query Example](https://github.com/sqlrooms/sqlrooms/tree/main/examples/query)
- [DuckDB WASM Documentation](https://duckdb.org/docs/api/wasm)
- [Overture Maps Data](https://overturemaps.org/)
- [DuckDB httpfs Extension](https://duckdb.org/docs/extensions/httpfs.html)

---

**Previous assumptions about browser limitations were incorrect.** The issue was version compatibility, which has now been resolved with the upgrade to DuckDB WASM 1.31.0.
