# Variable: queryUSZipcodes

> `const` **queryUSZipcodes**: `ExtendedTool`\<[`QueryZipcodeFunctionArgs`](../type-aliases/QueryZipcodeFunctionArgs.md), [`QueryZipcodeLlmResult`](../type-aliases/QueryZipcodeLlmResult.md), [`QueryZipcodeAdditionalData`](../type-aliases/QueryZipcodeAdditionalData.md), `never`\>

Defined in: [us/queryZipcode.ts:55](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/osm/src/us/queryZipcode.ts#L55)

Query US Zipcodes Tool

This tool queries US zipcodes within a given map bounds. It returns a list of zipcodes
with their coordinates that fall within the specified bounding box.

Example user prompts:
- "Find all zipcodes in Manhattan"
- "What zipcodes are in the San Francisco Bay Area?"
- "Get zipcodes within this map view"

Example code:
```typescript
import { queryUSZipcodes, QueryUSZipcodesTool } from "@openassistant/osm";

const queryZipcodeTool: QueryUSZipcodesTool = {
  ...queryUSZipcodes,
  context: {}
};
```
