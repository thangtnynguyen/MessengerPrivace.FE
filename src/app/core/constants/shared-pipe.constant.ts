import { DatePipe } from "@angular/common";
import { CurrencyFormatPipe } from "../pipes/currency-format.pipe";
import { SafePipe } from "../pipes/safe-pipe.pipe";

export const SharedPipe = [
    DatePipe,
    CurrencyFormatPipe,
    SafePipe
];
