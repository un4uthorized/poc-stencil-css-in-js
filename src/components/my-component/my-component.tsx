import { Component, Element, h } from '@stencil/core';

type StyleObject = { [key: string]: string };

function convertCssInJsToCss(style: StyleObject): string {
  let css = '';

  for (const [key, value] of Object.entries(style)) {
    css += `${toKebabCase(key)}: ${value};\n`;
  }

  return css;
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function ShadowStyle(style: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
      const element = this.el.shadowRoot.querySelector('.my-div');
      if (element) {
        const cssString = convertCssInJsToCss(style);
        console.log(target, propertyKey);
        element.style = cssString
      }
      return originalMethod.apply(this, arguments);
    }
    return descriptor;
  }
}


@Component({
  tag: 'my-component',
  shadow: true,

})
export class MyComponent {
  @Element() el: HTMLElement;

  @ShadowStyle({
    backgroundColor: 'purple',
  })
  componentDidRender() {
    console.log('The component has been rendered');
  }


  render() {
    return (
      <div class="my-div">
        This is my div
      </div>
    );
  }
}
