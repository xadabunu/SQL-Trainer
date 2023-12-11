import { AfterViewInit, Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'query-result',
    templateUrl: './query-result.component.html'
})
export class QueryResultComponent implements OnInit, AfterViewInit {

    @Input() timestamp?: string;

    resultLabel: string = '';
    resultDetails: string = '';
    resultTable: string = '<ul><li>yo</li></ul>';

    trs: string[] = ['ID_S', 'ID_P', 'ID_J', 'QTY', 'DATE'];
    tds: string[] = ['S1', 'P1', 'J1', '200', '02020202']

    static correctAnswer: string = 'Votre requête a retourné une réponse correcte!\nNéanmoins, \
                                    comparez votre solution avec celle(s) ci-dessous pour voir \
                                    si n\'avez pas eu un peu de chance... ;-)';
    static wrongAnswer: string = 'Votre requête a retourné un mauvais résultat:';
    static errorAnswer: string = 'Erreur de requête';

    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
        
    }
    
}