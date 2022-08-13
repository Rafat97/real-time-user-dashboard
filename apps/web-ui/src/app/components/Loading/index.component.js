import { LoadingOverlay, Button, Group } from '@mantine/core';

export default function LoadingComponent() {
  return (
    <div>
      Loading...
      <LoadingOverlay visible={true} overlayBlur={2} />
    </div>
  );
}
