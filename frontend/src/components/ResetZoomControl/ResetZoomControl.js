// Control implemented as ES6 class
class ResetZoomControl {
  onAdd(map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
      this._container.style.padding = `3px`;

      const icon = document.createElement('i');
      icon.className = 'material-icons';
      icon.style.verticalAlign = 'middle';
      icon.style.cursor = 'pointer';
      icon.textContent = 'explore';
      this._container.appendChild(icon);
      this._container.addEventListener('click', (e) => {
        map.flyTo({ center: [-106.64425246096249, 39.62037385121381], zoom: 9});
      });
      return this._container;
  }

  onRemove() {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
  }
}

export default ResetZoomControl;