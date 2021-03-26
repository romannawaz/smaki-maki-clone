import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScroll]'
})
export class ScrollDirective {

  scrollTop: number;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef
  ) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    if (this.scrollTop > $event.target['scrollingElement'].scrollTop) {
      this.renderer.addClass(this.element.nativeElement, 'scrollUp');
      this.renderer.removeClass(this.element.nativeElement, 'scrollDown');
    }
    else if ($event.target['scrollingElement'].scrollTop > 75) {
      this.renderer.addClass(this.element.nativeElement, 'scrollDown');
      this.renderer.removeClass(this.element.nativeElement, 'scrollUp');
    }

    this.scrollTop = $event.target['scrollingElement'].scrollTop;
  }
}
