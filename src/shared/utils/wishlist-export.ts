import ExcelJS from 'exceljs';
import { formatCategoryLabel } from 'shared/utils/category-label.util';
import { getSiteName } from 'shared/utils/get-site-name.util';
import {
  formatDescriptionForExport,
  getItemFavoriteOrPinnedFlag,
  parseItemDescription,
} from 'shared/utils/parse-item-description.util';
import {
  formatAudienceForExport,
  formatSuggestionForExport,
} from 'features/items/utils/item-audience.util';

export interface WishlistExportContext {
  exporterName?: string;
  isOwner?: boolean;
  currentUserId?: string;
}

const escapeCsvValue = (val: any) => {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

const toPascalCase = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9\s-_]+/g, '')
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

const getFormattedDate = (): string => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${mm}${dd}${yyyy}`;
};

const getExportFilename = (title: string, exporterName: string | undefined, ext: string): string => {
  const pascalTitle = toPascalCase(title) || 'Wishlist';
  const dateStr = getFormattedDate();
  const exporterClean = toPascalCase(exporterName || 'Export');
  return `${pascalTitle}_${dateStr}_${exporterClean}.${ext}`;
};

function getItemExportMeta(item: any, exportContext: WishlistExportContext = {}) {
  return {
    audience: formatAudienceForExport(
      item.SharedWith,
      exportContext.currentUserId,
      item.SuggestedByUserId
    ),
    suggestion: formatSuggestionForExport(item, !!exportContext.isOwner),
  };
}

// Process and sort items by Category (alphabetical), then Favorite/Starred status (top), then Priority (ascending), then Name (alphabetical)
function getSortedItemsWithPriority(items: any[]) {
  return items
    .map(item => ({
      ...item,
      isFav: getItemFavoriteOrPinnedFlag(item.Description),
      categoryFormatted: formatCategoryLabel(item.Category)
    }))
    .sort((a, b) => {
      // 1. Sort by Category (Uncategorized always goes last)
      if (a.categoryFormatted === 'Uncategorized' && b.categoryFormatted !== 'Uncategorized') return 1;
      if (a.categoryFormatted !== 'Uncategorized' && b.categoryFormatted === 'Uncategorized') return -1;
      const catCompare = a.categoryFormatted.localeCompare(b.categoryFormatted);
      if (catCompare !== 0) return catCompare;

      // 2. Sort by Favorite status
      if (a.isFav && !b.isFav) return -1;
      if (!a.isFav && b.isFav) return 1;

      // 3. Sort by numeric Priority (ascending)
      const aPri = a.Priority !== undefined && a.Priority !== null ? a.Priority : null;
      const bPri = b.Priority !== undefined && b.Priority !== null ? b.Priority : null;
      if (aPri !== null && bPri !== null) {
        if (aPri !== bPri) return aPri - bPri;
      } else if (aPri !== null && bPri === null) {
        return -1;
      } else if (aPri === null && bPri !== null) {
        return 1;
      }

      // 4. Sort by Name (alphabetical)
      return a.Name.localeCompare(b.Name);
    });
}

// 1. Export CSV (Sorted by Category, Raw Links)
export function exportToCsv(
  title: string,
  items: any[],
  priorities: any[] = [],
  exportContext: WishlistExportContext = {}
) {
  const headers = ['Category', 'Priority', 'Item', 'Star', 'Price', 'Website Link', 'Description', 'Audience', 'Suggestion'];
  const sorted = getSortedItemsWithPriority(items);
  const rows: any[][] = [];
  const emptyRow = ['', '', '', '', '', '', '', '', ''];

  // Group by category to output category section dividers in CSV too
  const categoryGroups: { [key: string]: any[] } = {};
  for (const item of sorted) {
    if (!categoryGroups[item.categoryFormatted]) {
      categoryGroups[item.categoryFormatted] = [];
    }
    categoryGroups[item.categoryFormatted].push(item);
  }

  const categories = Object.keys(categoryGroups).sort((a, b) => {
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
  });

  for (const cat of categories) {
    rows.push([`${cat}:`, '', '', '', '', '', '', '', '']);

    const catItems = categoryGroups[cat];
    for (const item of catItems) {
      const priorityVal = item.Priority !== null && item.Priority !== undefined ? item.Priority : '';
      const starVal = item.isFav ? '*' : '';
      const formattedDesc = formatDescriptionForExport(item.Description);
      const { audience, suggestion } = getItemExportMeta(item, exportContext);

      if (item.Links && item.Links.length > 0) {
        for (const link of item.Links) {
          const priceVal = link.ExtractedPrice !== null && link.ExtractedPrice !== undefined 
            ? `$${link.ExtractedPrice.toFixed(2)}` 
            : '';
          rows.push([
            '',
            priorityVal,
            item.Name,
            starVal,
            priceVal,
            link.Url || '',
            formattedDesc,
            audience,
            suggestion,
          ]);
        }
      } else {
        rows.push([
          '',
          priorityVal,
          item.Name,
          starVal,
          '',
          '',
          formattedDesc,
          audience,
          suggestion,
        ]);
      }
    }
    rows.push(emptyRow);
  }

  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => row.map(escapeCsvValue).join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, getExportFilename(title, exportContext.exporterName, 'csv'));
}

// 2. Export XLSX (Excel with cell hyperlinks, formatted sheet using ExcelJS)
export async function exportToXlsx(
  title: string,
  items: any[],
  priorities: any[] = [],
  exportContext: WishlistExportContext = {}
) {
  const sorted = getSortedItemsWithPriority(items);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Wishlist');

  worksheet.getColumn(1).width = 18;
  worksheet.getColumn(2).width = 12;
  worksheet.getColumn(3).width = 28;
  worksheet.getColumn(4).width = 8;
  worksheet.getColumn(5).width = 12;
  worksheet.getColumn(6).width = 18;
  worksheet.getColumn(7).width = 45;
  worksheet.getColumn(8).width = 18;
  worksheet.getColumn(9).width = 22;

  const headers = ['Category', 'Priority', 'Item', 'Star', 'Price', 'Website', 'Description', 'Audience', 'Suggestion'];
  const headerRow = worksheet.addRow(headers);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = {
      name: 'Inter',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5E6AD2' } // Brand color
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true
    };
  });

  // Group by category
  const categoryGroups: { [key: string]: any[] } = {};
  for (const item of sorted) {
    if (!categoryGroups[item.categoryFormatted]) {
      categoryGroups[item.categoryFormatted] = [];
    }
    categoryGroups[item.categoryFormatted].push(item);
  }

  const categories = Object.keys(categoryGroups).sort((a, b) => {
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
  });

  for (const cat of categories) {
    // Spacer row before category if not the first one
    if (worksheet.rowCount > 1) {
      worksheet.addRow([]);
    }

    // Category Header row
    const catRow = worksheet.addRow([`${cat}:`]);
    catRow.height = 22;
    const catCell = catRow.getCell(1);
    catCell.font = {
      name: 'Inter',
      size: 13,
      bold: true,
      color: { argb: 'FF111111' }
    };
    catCell.alignment = { vertical: 'middle', wrapText: true };

    const catItems = categoryGroups[cat];
    for (const item of catItems) {
      const priorityVal = item.Priority !== null && item.Priority !== undefined ? item.Priority : '';
      const starVal = item.isFav ? '*' : '';
      const formattedDesc = formatDescriptionForExport(item.Description);
      const { audience, suggestion } = getItemExportMeta(item, exportContext);

      let priceVal = '';
      let websiteLabel = '';
      let linkUrl = '';

      if (item.Links && item.Links.length > 0) {
        const link = item.Links[0];
        priceVal = link.ExtractedPrice !== null && link.ExtractedPrice !== undefined 
          ? `$${link.ExtractedPrice.toFixed(2)}` 
          : '';
        
        websiteLabel = link.RetailerName || (link.Url ? getSiteName(link.Url) : 'Store');
        linkUrl = link.Url || '';
      }

      const itemRow = worksheet.addRow([
        '',
        priorityVal,
        item.Name,
        starVal,
        priceVal,
        websiteLabel,
        formattedDesc,
        audience,
        suggestion,
      ]);

      // Formatting text styles
      itemRow.eachCell((cell, colNumber) => {
        if (colNumber === 6 && linkUrl) {
          cell.value = { text: websiteLabel, hyperlink: linkUrl };
          cell.font = {
            name: 'Inter',
            size: 10,
            color: { argb: 'FF0055FF' },
            underline: true
          };
        } else {
          cell.font = {
            name: 'Inter',
            size: 10,
            color: { argb: 'FF333333' }
          };
        }
        cell.alignment = { 
          vertical: 'middle', 
          horizontal: 'left', 
          wrapText: true 
        };
      });
    }
  }

  // Write workbook to buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadBlob(blob, getExportFilename(title, exportContext.exporterName, 'xlsx'));
}

// 3. Export TXT (Beautiful category-based document)
export function exportToTxt(
  title: string,
  items: any[],
  priorities: any[] = [],
  exportContext: WishlistExportContext = {}
) {
  const sorted = getSortedItemsWithPriority(items);
  
  const sections: string[] = [];
  sections.push('============================================================');
  sections.push(`WISHLIST REGISTRY: ${title.toUpperCase()}`);
  sections.push('============================================================');
  sections.push('');

  const categoryGroups: { [key: string]: any[] } = {};
  for (const item of sorted) {
    if (!categoryGroups[item.categoryFormatted]) {
      categoryGroups[item.categoryFormatted] = [];
    }
    categoryGroups[item.categoryFormatted].push(item);
  }

  const categories = Object.keys(categoryGroups).sort((a, b) => {
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
  });

  for (const cat of categories) {
    sections.push(`[${cat.toUpperCase()}]`);
    sections.push('-'.repeat(cat.length + 2));

    const catItems = categoryGroups[cat];
    for (const item of catItems) {
      const starPrefix = item.isFav ? '★ ' : '  ';
      const priorityLabel = item.Priority !== null && item.Priority !== undefined ? `(Priority: ${item.Priority})` : '';
      const descText = formatDescriptionForExport(item.Description);
      const descStr = descText ? `\n    Description: ${descText}` : '';
      const { audience, suggestion } = getItemExportMeta(item, exportContext);
      const metaStr = `\n    Audience: ${audience}${suggestion ? `\n    Suggestion: ${suggestion}` : ''}`;

      if (item.Links && item.Links.length > 0) {
        for (const link of item.Links) {
          const priceStr = link.ExtractedPrice !== null && link.ExtractedPrice !== undefined 
            ? ` - $${link.ExtractedPrice.toFixed(2)}` 
            : '';
          const retailer = link.RetailerName || 'Store';
          sections.push(`${starPrefix}${item.Name}${priceStr} ${priorityLabel}`);
          if (link.Url) {
            sections.push(`    Link: ${retailer} (${link.Url})`);
          }
          if (descStr) {
            sections.push(descStr);
          }
          sections.push(metaStr);
        }
      } else {
        sections.push(`${starPrefix}${item.Name} ${priorityLabel}`);
        if (descStr) {
          sections.push(descStr);
        }
        sections.push(metaStr);
      }
      sections.push('');
    }
    sections.push('');
  }

  const txtContent = sections.join('\n');
  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
  downloadBlob(blob, getExportFilename(title, exportContext.exporterName, 'txt'));
}

// 4. Export JSON (Professional, structured JSON format)
export function exportToJson(
  title: string,
  items: any[],
  priorities: any[] = [],
  exportContext: WishlistExportContext = {}
) {
  const sorted = getSortedItemsWithPriority(items);

  const formattedItems = sorted.map(item => {
    const parsed = parseItemDescription(item.Description);
    const parsedDesc = parsed.isJson && parsed.metadata ? parsed.metadata : item.Description;
    const { audience, suggestion } = getItemExportMeta(item, exportContext);

    return {
      name: item.Name,
      category: item.categoryFormatted,
      priority: item.Priority,
      isFavorite: item.isFav,
      description: parsedDesc,
      audience,
      suggestion: suggestion || undefined,
      links: (item.Links || []).map((link: any) => ({
        url: link.Url || '',
        retailer: link.RetailerName || '',
        price: link.ExtractedPrice
      }))
    };
  });

  const data = {
    wishlistTitle: title,
    exportedAt: new Date().toISOString(),
    items: formattedItems
  };

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, getExportFilename(title, exportContext.exporterName, 'json'));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
