// lib/nav-types.ts
export type LinkItem = {
  type: "link";
  href: string;
  label: string;
  icon: string; // path to svg/png
};

export type FolderItem = {
  type: "folder";
  label: string;
  icon: string; // folder icon or any image
  items: LinkItem[]; // only links inside folders for simplicity
};

export type PanelItem = {
  type: "panel";
  title: string;
  initiallyCollapsed?: boolean;
  children: Array<LinkItem | FolderItem>; // allow links & folders in a panel
};

export type NavItem = LinkItem | FolderItem | PanelItem;
