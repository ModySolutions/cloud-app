const ColorPicker = {
    init: () => {
        ColorPicker.action();
    },
    action: () => {
        acf.addFilter('color_picker_args', (args, field) => {
            args.palettes = ['#134740', '#BAD46E', '#C6421E', '#000000', '#FFFFFF'];
            return args;
        });
    }
}

export default ColorPicker;