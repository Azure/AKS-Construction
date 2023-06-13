import React from "react";
import { useBoolean } from "@fluentui/react-hooks";
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton,DefaultButton } from '@fluentui/react/lib/Button';

export function PreviewDialog({previewLink}) {

  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Preview Feature',
    closeButtonAriaLabel: 'Close',
    subText: `Review the instructions on this page ${previewLink} to enable the feature `,
  };

  function _openLink() {
    window.open(`${previewLink}`, '_blank', 'noreferrer');
  }

  return (
    <div>
      <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={dialogContentProps}>
      <DialogFooter>
        <PrimaryButton onClick={toggleHideDialog} text="Close" />
        <DefaultButton onClick={_openLink} text="Open Link in New Tab" />
      </DialogFooter>
      </Dialog>
    </div>
  );
}
