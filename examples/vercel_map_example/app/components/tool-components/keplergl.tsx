import {
  isCreateMapOutputData,
  KeplerGlToolComponent,
} from '@openassistant/keplergl';

export function KeplerGlTool({ additionalData }: { additionalData: unknown }) {
  if (isCreateMapOutputData(additionalData)) {
    return <KeplerGlToolComponent {...additionalData} />;
  }
  return null;
}
