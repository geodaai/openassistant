import {
  CreateMapOutputData,
  isCreateMapOutputData,
  KeplerGlToolComponent,
} from 'packages/components/keplergl/dist';
import { memo } from 'react';

export const KeplerGlTool = memo(
  function KeplerGlTool({ additionalData }: { additionalData: unknown }) {
    if (isCreateMapOutputData(additionalData)) {
      return <KeplerGlToolComponent {...additionalData} />;
    }
    return null;
  },
  (prevProps, nextProps) => {
    // Deep comparison of additionalData
    return (
      (prevProps.additionalData as CreateMapOutputData).datasetId ===
      (nextProps.additionalData as CreateMapOutputData).datasetId
    );
  }
);

export default KeplerGlTool;
