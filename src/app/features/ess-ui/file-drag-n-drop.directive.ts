import { Directive, HostListener, HostBinding, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[fileDragDrop]'
})

export class FileDragNDropDirective {
  @Output() private filesChangeEmiter : EventEmitter<File[]> = new EventEmitter();


  constructor() { }

  @HostListener('dragover', ['$event']) public onDragOver(event: any){
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: any){
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event']) public onDrop($event: any){
    $event.preventDefault();
    $event.stopPropagation();
    this.filesChangeEmiter.emit($event);
  }
}