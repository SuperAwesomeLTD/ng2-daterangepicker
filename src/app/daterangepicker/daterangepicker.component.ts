import { Directive, OnInit, OnChanges,SimpleChanges, AfterViewInit, Input, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
//import { ControlValueAccessor } from '@angular/forms';
import { DaterangepickerConfig } from './config.service';

import * as moment from 'moment';
import 'bootstrap-daterangepicker';
//import * as $ from 'jquery'

export interface IDateRange{
    startDate:Date,
    endDate:Date
}

@Directive({
    selector: '[daterangepicker]'
})
export class DaterangePickerComponent implements AfterViewInit, OnDestroy, OnChanges {

    @Input() options: any = {};
    @Input() selectedDateRange? : IDateRange;
    @Output() selected = new EventEmitter();

    // daterangepicker events
    @Output() cancelDaterangepicker = new EventEmitter();
    @Output() applyDaterangepicker = new EventEmitter();
    @Output() hideCalendarDaterangepicker = new EventEmitter();
    @Output() showCalendarDaterangepicker = new EventEmitter();
    @Output() hideDaterangepicker = new EventEmitter();
    @Output() showDaterangepicker = new EventEmitter();

    public datePicker: any;

    constructor(private input: ElementRef, private config: DaterangepickerConfig) { }

    ngAfterViewInit() {



        let targetOptions: any = Object.assign({}, this.config.settings, this.options);

        if (this.selectedDateRange) {
               targetOptions.startDate = this.selectedDateRange.startDate;
               targetOptions.endDate = this.selectedDateRange.endDate;
        }
        // tell config service to embed the css
        this.config.embedCSS();

        // cast $ to any to avoid jquery type checking
        //$(this.input.nativeElement).daterangepicker(targetOptions, this.callback.bind(this));
        (<any>$(this.input.nativeElement)).daterangepicker(targetOptions, this.callback.bind(this));

        this.datePicker = (<any>$(this.input.nativeElement)).data('daterangepicker');

        $(this.input.nativeElement).on('cancel.daterangepicker',
            (e:any, picker:any) => {
                let event = { event: e, picker: picker };
                this.cancelDaterangepicker.emit(event);
            }
        );

        $(this.input.nativeElement).on('apply.daterangepicker',
            (e:any, picker:any) => {
                let event = { event: e, picker: picker };
                this.applyDaterangepicker.emit(event);
            }
        );

        $(this.input.nativeElement).on('hideCalendar.daterangepicker',
            (e:any, picker:any) => {
                let event = { event: e, picker: picker };
                this.hideCalendarDaterangepicker.emit(event);
            }
        );

        $(this.input.nativeElement).on('showCalendar.daterangepicker',
            (e:any, picker:any) => {
                let event = { event: e, picker: picker };
                this.showCalendarDaterangepicker.emit(event);
            }
        );

        $(this.input.nativeElement).on('hide.daterangepicker',
            (e:any, picker:any) => {
                let event = { event: e, picker: picker };
                this.hideDaterangepicker.emit(event);
            }
        );

        $(this.input.nativeElement).on('show.daterangepicker',
            (e:any, picker:any) => {
                let event = { event: e, picker: picker };
                this.showDaterangepicker.emit(event);
            }
        );
    }

    private callback(start?: any, end?: any, label?: any): void {
        let obj = {
            start: start,
            end: end,
            label: label
        };

        this.selected.emit(obj);
    }


    ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
        if(!this.datePicker){
            return;
        }
        if(changes.selectedDateRange){
            const newSelectedDate = changes.selectedDateRange.currentValue;
            (<any>$(this.input.nativeElement))
                .data('daterangepicker')
                .setStartDate(newSelectedDate.startDate);
            (<any>$(this.input.nativeElement))
                .data('daterangepicker')
                .setEndDate(newSelectedDate.endDate);
        }
    }
    ngOnDestroy() {
        try {
            (<any>$(this.input.nativeElement)).data('daterangepicker').remove();
        } catch(e) {
            console.log(e.message);
        }
    }
}
