export default class MarkerOverLay extends google.maps.OverlayView {
  private position: google.maps.LatLng;
  private div: HTMLDivElement | null = null;
  private img: HTMLImageElement | null = null;
  private markerUrl: string;
  private name: string;
  private onClick: (isDrawerOpen?: boolean) => void;
  private isMatchData: boolean = false;

  constructor(name: string, position: google.maps.LatLng, markerUrl: string, isMatchData: boolean, onClick: () => void) {
    super();
    this.name = name
    this.position = position;
    this.markerUrl = markerUrl;
    this.onClick = onClick;
    this.isMatchData = isMatchData;
  }

  onAdd() {
    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.transform = 'translate(-50%, -100%)';
    this.div.innerHTML = `<img id="markerImage" src="${this.markerUrl}" alt="marker" class="w-16 h-16 transition-all duration-500 ease-in-out transform-origin-bottom"/>`;
    this.div.style.zIndex = this.isMatchData ? '2': '1';
    const panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.div);
    this.img = this.div.querySelector('#markerImage') as HTMLImageElement;
    
    if (this.div) {
      this.div.addEventListener('click', () => this.onClick());
    }
  }

  draw() {
    if (!this.div) return;

    const overlayProjection = this.getProjection();
    const point = overlayProjection.fromLatLngToDivPixel(this.position);

    if (point) {
      this.div.style.left = `${point.x}px`;
      this.div.style.top = `${point.y}px`;
    }
  }

  onRemove() {
    if (this.div) {
      (this.div.parentNode as HTMLElement).removeChild(this.div);
      this.div = null;
      this.img = null;
    }
  }

  highlightMarker() {
    if (!this.img || !this.div) return;
    if (this.img.classList.contains('w-16')) {
      this.img.classList.remove('w-16', 'h-16');
      this.img.classList.add('w-24', 'h-24'); // 動的にサイズを変更
      this.div.style.zIndex = '10';
    }
  }

  unhighlightMarker() {
    if (!this.img || !this.div) return;
    if (this.img.classList.contains('w-24')) {
      this.img.classList.remove('w-24', 'h-24');
      this.img.classList.add('w-16', 'h-16'); // 動的にサイズを変更
      this.div.style.zIndex = this.isMatchData ? '2': '1';
    }
  }

  public getPosition() {
    return this.position;
  }

  public getName() {
    return this.name;
  }

  public remove() {
    this.setMap(null); // オーバーレイを地図から削除する
  }
}
