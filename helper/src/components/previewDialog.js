import React from "react";
import { useBoolean } from "@fluentui/react-hooks";
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton } from '@fluentui/react/lib/Button';

export function PreviewDialog({previewLink}) {

  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);
    const dialogContentProps = {
      type: DialogType.normal,
      title: 'Preview Feature',
      closeButtonAriaLabel: 'Close',
      subText: `Review the instructions on this page ${previewLink}
      to enable the feature `,
    };
  return (
    <div>
      <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={dialogContentProps}
      >
      <DialogFooter>
      <PrimaryButton onClick={toggleHideDialog} text="Close" />
    </DialogFooter>
      </Dialog>
    </div>
  );
}
