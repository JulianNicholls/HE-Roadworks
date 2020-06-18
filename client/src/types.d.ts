type WorksItem = {
  roads: string;
  description: string;
  startDate: string;
  endDate: string;
  expectedDelay: string;
  closureType: string;
  centreEasting: number;
  centreNorthing: number;
};

type ENLocation = {
  east: number;
  north: number;
};

type RoadIndex = {
  roads: string;
  index: number;
};

type WorksState = {
  roadworks: Array<WorksItem>;
  roads: Array<RoadIndex>;
  selected: string;
  searchText: string;
  centreEN: ENLocation;
  selectedRoadworks(): Array<WorksItem>;
  setSelected(string): void;
  setSearchText(string): void;
  setCentreEN(ENLocation): void;
};
