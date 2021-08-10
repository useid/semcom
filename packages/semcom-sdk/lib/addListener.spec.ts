import { addListener } from './addListener';
import { ComponentEventTypes, ComponentReadEvent, ComponentResponseEvent } from './component/models/component-events.model';

describe('addListener', () => {

  let element: HTMLElement;
  let process: jest.Mock<any, any>;

  beforeEach(() => {

    element = document.createElement('test');
    process = jest.fn().mockImplementation((event: ComponentReadEvent<'quads'>) => new ComponentResponseEvent({}));

  });

  it('should be dispatch process', () => {

    addListener(ComponentEventTypes.READ, 'quads', element, process);

    element.dispatchEvent(
      new CustomEvent(
        ComponentEventTypes.READ,
        {
          detail: {
            uri: 'test',
            data: undefined,
            success: true,
            type: 'quads',
          },
        }
      )
    );

    expect(process).toBeCalledTimes(1);

  });

  it("should throw when type doesn't match", () => {

    addListener(ComponentEventTypes.READ, 'quads', element, process);

    element.dispatchEvent(
      new CustomEvent(
        ComponentEventTypes.READ,
        {
          detail: {
            uri: 'test',
            data: undefined,
            success: true,
            type: 'json',
          },
        }
      )
    );

    expect(process).toBeCalledTimes(0);

  });

  it('should throw when event detail is empty', () => {

    addListener(ComponentEventTypes.READ, 'quads', element, process);

    element.dispatchEvent(new CustomEvent(ComponentEventTypes.READ));

    expect(process).toBeCalledTimes(0);

  });

});
