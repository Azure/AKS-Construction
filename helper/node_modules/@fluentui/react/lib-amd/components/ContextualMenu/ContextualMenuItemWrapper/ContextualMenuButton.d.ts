import { ContextualMenuItemWrapper } from './ContextualMenuItemWrapper';
export declare class ContextualMenuButton extends ContextualMenuItemWrapper {
    private _btn;
    private _ariaDescriptionId;
    private _getMemoizedMenuButtonKeytipProps;
    render(): JSX.Element;
    protected _renderAriaDescription: (ariaDescription?: string | undefined, className?: string | undefined) => JSX.Element | null;
    protected _getSubmenuTarget: () => HTMLElement | undefined;
}
