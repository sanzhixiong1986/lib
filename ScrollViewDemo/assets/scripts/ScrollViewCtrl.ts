
const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollViewCtrl extends cc.Component {
    @property({ type: cc.Prefab, tooltip: "加载项的预制体" })
    itemPrefab: cc.Prefab = null;

    @property
    public widths: number = 0;;

    @property
    public heights: number = 0;

    PAGE_NUM: number = 10;
    ITEM_HEIGHT: number = 0;  // 每一条记录项的高度

    private valueSet: Array<number> = [];
    private itemSet: Array<cc.Node> = [];  // 加载项节点数组

    private scrollView: cc.ScrollView = null;
    private content: cc.Node = null;

    private startIndex: number = 0;    // 每页起始的索引
    private startY: number = 0;        // 最开始的时候content的位置的y值

    onLoad() {
        this.loadData();        // 加载数据
        this.scrollView = this.node.getComponent(cc.ScrollView);
        this.scrollView.node.width = this.widths;
        this.scrollView.node.height = this.heights;
        this.content = this.scrollView.content;
        this.ITEM_HEIGHT = this.itemPrefab.data.height;
        this.initItem();        // 初始化加载项，将数据填入加载项中

        this.scrollView.node.on("scroll-ended", this.onScrollEnded.bind(this), this);
    }

    onScrollEnded() {
        this.loadNextPage();
        this.scrollView.elastic = true;
    }

    initItem() {
        for (let i = 0; i < this.PAGE_NUM * 3; i++) {
            if (this.valueSet[i]) {
                let item: cc.Node = cc.instantiate(this.itemPrefab);
                this.content.addChild(item);
                this.itemSet.push(item);
            }
        }
    }
    loadData() {
        for (let i = 1; i <= 100; i++) {
            this.valueSet.push(i);
        }
    }

    start() {
        this.refreshInfo(this.startIndex);
        this.startY = this.content.y;
    }
    refreshInfo(startIndex: number) {
        this.startIndex = startIndex;
        for (let i = 0; i < this.PAGE_NUM * 3; i++) {
            this.itemSet[i].getChildByName("Info").getComponent(cc.Label).string = "" + this.valueSet[startIndex + i];
        }
    }

    update(dt: number) {
        this.loadNextPage();    // 加载下一页
    }

    loadNextPage() {
        // 判断是否需要加载下一页
        if (this.startIndex + this.PAGE_NUM * 3 < this.valueSet.length &&
            this.content.y >= this.startY + 2 * this.ITEM_HEIGHT * this.PAGE_NUM) {

            if (this.scrollView._autoScrolling) { // 等待自动滚动结束后再做处理
                this.scrollView.elastic = false;    // 暂时关闭回弹效果
                return;
            }

            let downLoaded: number = this.PAGE_NUM;    // 记录向下新加载的数据量
            this.startIndex += downLoaded;
            // 实际剩余的数据不足一页的情况下，要修正加载的数据量
            if (this.startIndex + this.PAGE_NUM * 3 > this.valueSet.length) {
                let outLen: number = this.startIndex + this.PAGE_NUM * 3 - this.valueSet.length;
                downLoaded -= outLen;
                this.startIndex -= outLen;  // 保证最后一页显示完整
            }
            this.refreshInfo(this.startIndex);
            this.content.y -= (downLoaded * this.ITEM_HEIGHT);
            return;
        }

        // 是否需要向上滚动
        if (this.startIndex > 0 && this.content.y <= this.startY) {

            if (this.scrollView._autoScrolling) { // 等待自动滚动结束后再做处理
                this.scrollView.elastic = false;    // 暂时关闭回弹效果
                return;
            }

            let upLoaded = this.PAGE_NUM;
            this.startIndex -= upLoaded;
            if (this.startIndex < 0) {
                upLoaded += this.startIndex;
                this.startIndex = 0;
            }
            this.refreshInfo(this.startIndex);
            this.content.y += (upLoaded * this.ITEM_HEIGHT);
        }
    }
}
