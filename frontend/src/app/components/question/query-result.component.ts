import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { QueryResult } from "src/app/models/queryResult";

@Component({
    selector: 'query-result',
    templateUrl: './query-result.component.html',
    styleUrls: ['./query-result.component.css']
})
export class QueryResultComponent implements OnChanges, OnInit, AfterViewInit {

    @Input() qr?: QueryResult;

    resultLabel: string = '';
    resultDetails: string = '';

    correctAnswerLabel: string = 'Votre requête a retourné une réponse correcte!';
    correctAnswerDetails: string = "Néanmoins, comparez votre solution avec celle(s) ci-dessous pour voir \
                                    si n\'avez pas eu un peu de chance... ;-)";

    ths: string[] = [];
    data: string[][] = []

    queryErrorLabel: string = 'Votre requête a retourné un mauvais résultat:';
    sqlErrorLabel: string = 'Erreur de requête';

    constructor(
    ) {

    }

    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.qr && this.qr) {
            if (this.qr.sqlError) {
                this.resultLabel = this.sqlErrorLabel;
            }
            else
                this.resultLabel = this.qr.isCorrect ? this.correctAnswerLabel : this.queryErrorLabel;
            this.ths = this.qr.columns;
            this.data = this.qr.data;
        }
    }
    
}