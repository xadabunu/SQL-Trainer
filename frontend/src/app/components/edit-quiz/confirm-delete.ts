import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    templateUrl: './confirm-delete.html'
})
export class ConfirmDeleteComponent {
    constructor (
        public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
}