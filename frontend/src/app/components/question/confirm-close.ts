import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    templateUrl: './confirm-close.html'
})
export class ConfirmCloseAttemptComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmCloseAttemptComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
}