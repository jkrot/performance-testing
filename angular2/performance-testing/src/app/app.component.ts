import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    constructor() { 

        this.filecount = 0;

    }

    ngOnInit() {
    }

    filestring: string;
    filecount: number;

    handleInputChange(e) {
        var folder = e.target.files;
        var len = folder.length;

        for(var i = 0; i < len; i++){
            var reader = new FileReader();
            var key = i;
            var file = folder[key];
            var blob;
            var overridesize = false;

            if (file.size > 4096){
                if (overridesize){
                    blob = file;
                }else if (file.size < 32768){
                    blob = file;
                }else{
                    blob = file.slice(0,32768);
                }

                reader.readAsArrayBuffer(blob);

            }else{
                
            }

            reader.onload = this._handleReaderLoaded.bind(this);

            reader.readAsArrayBuffer(blob);

            reader = undefined;
            file = undefined;
            blob = undefined;

        } // End For
       
    }

    _handleReaderLoaded(readerEvt) {
        var arrayBuffer = readerEvt.target.result;
        this.filecount = this.filecount + 1;
        this.filestring = "Number of Files Read " + this.filecount.toString();
    };



}
