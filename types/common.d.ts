export interface IDictData {
  code: string;
  dictKey: string;
  dictValue: string;
  id: string;
  parentId: string;
  sort: number;
  [key: string]: any;
}

export interface ITableItem {
  label: string;
  width: string | number;
  dataIndex: string;
  slot: string;
  type: string;
}