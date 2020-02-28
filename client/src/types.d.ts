interface WorksItem {
  roads: string;
  description: string;
  startDate: Date;
  endDate: Date;
  expectedDelay: string;
  closureType: string;
  centreEasting: number;
  centreNorthing: number;
}

interface ENLocation {
  east: number;
  north: number;
}

interface RoadIndex {
  roads: string;
  index: number;
}

interface WorksState {
  roadworks: Array<WorksItem>;
  roads: Array<RoadIndex>;
  selected: string;
  searchText: string;
  centreEN: ENLocation;
  selectedRoadworks(): Array<WorksItem>;
  setSelected(string): void;
  setSearchText(string): void;
  setCentreEN(ENLocation): void;
}
