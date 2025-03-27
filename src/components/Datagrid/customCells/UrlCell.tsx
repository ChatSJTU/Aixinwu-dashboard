import {
    CustomCell,
    CustomRenderer,
    GridCellKind,
} from "@glideapps/glide-data-grid";

export interface URLCellData {
    kind: "url-cell";
    url: string;
    onClick?: () => void;
    hovered?: boolean;
}

export type URLCell = CustomCell<URLCellData>;

export const urlCellRenderer = (): CustomRenderer<URLCell> => ({
    kind: GridCellKind.Custom,
    isMatch: (cell): cell is URLCell => (cell.data as any).kind === "url-cell",

    draw: (args, cell) => {
        const { ctx, theme, rect, hoverX, hoverY } = args;
        const { x, y, width, height } = rect;

        const textColor = hoverX ? theme.accentColor : theme.textDark;
        const iconColor = hoverX ? theme.accentColor : theme.textDark;

        console.log(hoverX)

        // 绘制下载图标
        ctx.beginPath();
        ctx.strokeStyle = iconColor;
        ctx.lineWidth = 2;

        const iconSize = 14;
        const fontSize = 14;
        const frameOffset = 8; 
        const maxFrameWidth = 70;
        const iconX = x + 14;
        const iconY = y + height / 2 + iconSize / 2;

        // 箭头主体
        ctx.moveTo(iconX + iconSize / 2, iconY - iconSize);
        ctx.lineTo(iconX + iconSize / 2, iconY);
        ctx.stroke();

        // 箭头头部
        ctx.beginPath();
        ctx.moveTo(iconX + iconSize / 2 - iconSize / 2.5, iconY - iconSize / 2.5);
        ctx.lineTo(iconX + iconSize / 2, iconY);
        ctx.lineTo(iconX + iconSize / 2 + iconSize / 2.5, iconY - iconSize / 2.5);
        ctx.stroke();

        // 绘制文字
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize}px ${theme.fontFamily}`;
        ctx.fillText("下载", iconX + iconSize + 8, y + height / 2 + getMiddleCenterBias(ctx));
        
        ctx.lineWidth = 1
        /*
        ctx.moveTo(x + frameOffset, y + frameOffset )
        ctx.lineTo(x + frameOffset, y - frameOffset + height)
        ctx.lineTo(x - frameOffset + Math.min(width, maxFrameWidth), y - frameOffset + height)
        ctx.lineTo(x - frameOffset + Math.min(width, maxFrameWidth), y + frameOffset)
        ctx.lineTo(x + frameOffset, y + frameOffset)
        */
        ctx.roundRect(x + frameOffset, y + frameOffset, Math.min(width, maxFrameWidth), height - 2 * frameOffset, 6)
        ctx.stroke();

        return true;
    },

    needsHover: true,

    onClick: (args: { cell: URLCell }) => {
        // console.log(args.cell.data)
        args.cell.data.onClick.call(args.cell)
        return undefined
    }

});

function getMiddleCenterBias(ctx: CanvasRenderingContext2D) {
    return (ctx.measureText("M").actualBoundingBoxAscent -
        ctx.measureText("M").actualBoundingBoxDescent) / 2;
}

