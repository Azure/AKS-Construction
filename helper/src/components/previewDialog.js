import React from "react";
import { useBoolean } from "@fluentui/react-hooks";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";

export function PreviewDialog({ previewLink, onClose, show}) {
  // const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);

  const dialogContentProps = {
    type: DialogType.normal,
    title: "Preview Feature",
    closeButtonAriaLabel: "Close",
    // subText: `Review the instructions on this page ${previewLink} to enable the feature `,
  };
  if(!show){
    return null;
}
  return (
    <>
          <Dialog
            hidden={false}
            onDismiss={onClose}
            dialogContentProps={dialogContentProps} >
            <div>Review the instructions on this <a href={previewLink} target='_blank' rel="noreferrer" >page</a> to enable the feature</div>
            <DialogFooter>
              <PrimaryButton onClick={onClose} text="Close" />
            </DialogFooter>
          </Dialog>
    </>
  );
}
