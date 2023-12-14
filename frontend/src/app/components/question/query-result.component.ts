import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { QueryResult } from "src/app/models/queryResult";

@Component({
    selector: 'query-result',
    templateUrl: './query-result.component.html'
})
export class QueryResultComponent implements OnChanges, OnInit, AfterViewInit {

    @Input() timestamp?: string;
    @Input() qr?: QueryResult;

    resultLabel: string = '';
    resultDetails: string = '';

    ths: string[] = [];
    data: string[][] = []

    static correctAnswer: string = 'Votre requête a retourné une réponse correcte!\nNéanmoins, \
comparez votre solution avec celle(s) ci-dessous pour voir \
si n\'avez pas eu un peu de chance... ;-)';
    static wrongAnswer: string = 'Votre requête a retourné un mauvais résultat:';
    static errorAnswer: string = 'Erreur de requête';

    constructor(
        public snackBar: MatSnackBar
    ) {

    }

    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.qr && this.qr) {
            if (this.qr.sqlError) {
                this.resultLabel = QueryResultComponent.errorAnswer;
                this.snackBar.open(this.qr.sqlError, 'Dismiss', { duration: 2000 });
                console.log(this.qr.sqlError)
            }
            else
                this.resultLabel = this.qr.isCorrect ? QueryResultComponent.correctAnswer : QueryResultComponent.wrongAnswer;
            this.ths = this.qr.columns;
            this.data = this.qr.data;
        }
    }
    
}