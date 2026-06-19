export function exportToCsv(title: string, items: any[], priorities: any[] = []) {
  const headers = [
    'Item(s):',
    'Star(s):',
    'Price:',
    'Website(s):',
    'Description(s):',
    'Gift Card(s):',
    'Clothing:'
  ];

  const escapeCsvValue = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    // Always wrap in double quotes and escape internal double quotes
    return `"${str.replace(/"/g, '""')}"`;
  };

  const parseDescriptionForCsv = (desc: string | null): string => {
    if (!desc) return '';
    try {
      if (desc.startsWith('{') && desc.endsWith('}')) {
        const parsed = JSON.parse(desc);
        if (parsed && typeof parsed === 'object') {
          const parts: string[] = [];
          if (parsed.text) parts.push(parsed.text);
          
          const metaParts: string[] = [];
          if (parsed.pantsSize) metaParts.push(`Pants: ${parsed.pantsSize}`);
          if (parsed.shirtSize) metaParts.push(`Shirt: ${parsed.shirtSize}`);
          if (parsed.shoesSize) metaParts.push(`Shoes: ${parsed.shoesSize}`);
          if (parsed.socksSize) metaParts.push(`Socks: ${parsed.socksSize}`);
          if (parsed.color) metaParts.push(`Color: ${parsed.color}`);
          if (Array.isArray(parsed.custom)) {
            for (const f of parsed.custom) {
              if (f.name && f.value) {
                metaParts.push(`${f.name}: ${f.value}`);
              }
            }
          }
          if (metaParts.length > 0) {
            parts.push(`[${metaParts.join(', ')}]`);
          }
          return parts.join(' ');
        }
      }
    } catch (_) {}
    return desc;
  };

  const priorityMap = new Map<string, any>();
  for (const p of priorities) {
    priorityMap.set(p.Id, p);
  }

  const giftCardItems: any[] = [];
  const clothingItems: any[] = [];
  const regularItems: any[] = [];

  for (const item of items) {
    const priority = item.PriorityId ? priorityMap.get(item.PriorityId) : null;
    const label = priority ? priority.Label.toLowerCase() : '';
    
    if (label.includes('gift card')) {
      giftCardItems.push(item);
    } else if (label.includes('clothing')) {
      clothingItems.push(item);
    } else {
      regularItems.push(item);
    }
  }

  // 1. Build regular rows (grouped by priority, with header rows)
  const regularRows: any[] = [];
  
  // Group regular items
  const groups: { [key: string]: { priority: any | null; items: any[] } } = {};
  for (const p of priorities) {
    const labelLower = p.Label.toLowerCase();
    if (!labelLower.includes('gift card') && !labelLower.includes('clothing')) {
      groups[p.Id] = { priority: p, items: [] };
    }
  }
  const uncategorizedKey = 'uncategorized';
  groups[uncategorizedKey] = { priority: null, items: [] };

  for (const item of regularItems) {
    const key = item.PriorityId && groups[item.PriorityId] ? item.PriorityId : uncategorizedKey;
    groups[key].items.push(item);
  }

  const sortedGroups = Object.values(groups)
    .filter(g => g.items.length > 0)
    .sort((a, b) => {
      if (!a.priority) return 1;
      if (!b.priority) return -1;
      return b.priority.Weight - a.priority.Weight;
    });

  for (const group of sortedGroups) {
    // Add header row
    const groupLabel = group.priority ? group.priority.Label : 'General Items';
    regularRows.push([`${groupLabel}:`, '', '', '', '']);

    for (const item of group.items) {
      const isStarred = group.priority && group.priority.Label.includes('*');
      const starVal = isStarred ? '*' : '';

      const formattedDesc = parseDescriptionForCsv(item.Description);
      if (item.Links && item.Links.length > 0) {
        for (const link of item.Links) {
          const priceVal = link.ExtractedPrice !== null && link.ExtractedPrice !== undefined 
            ? `$${link.ExtractedPrice.toFixed(2)}` 
            : '';
          regularRows.push([
            item.Name,
            starVal,
            priceVal,
            link.RetailerName || link.Url || '',
            formattedDesc
          ]);
        }
      } else {
        regularRows.push([
          item.Name,
          starVal,
          '',
          '',
          formattedDesc
        ]);
      }
    }
  }

  // 2. Build gift card rows
  const giftCardRows: string[] = [];
  for (const item of giftCardItems) {
    giftCardRows.push(item.Name);
  }

  // 3. Build clothing rows
  const clothingRows: string[] = [];
  for (const item of clothingItems) {
    clothingRows.push(item.Name);
  }

  // 4. Combine side-by-side
  const maxRows = Math.max(regularRows.length, giftCardRows.length, clothingRows.length);
  const rows: any[] = [];
  
  for (let i = 0; i < maxRows; i++) {
    const reg = regularRows[i] || ['', '', '', '', ''];
    const gc = giftCardRows[i] || '';
    const cl = clothingRows[i] || '';
    
    rows.push([
      reg[0], // Item(s)
      reg[1], // Star(s)
      reg[2], // Price
      reg[3], // Website(s)
      reg[4], // Description(s)
      gc,     // Gift Card(s)
      cl      // Clothing
    ]);
  }

  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => row.map(escapeCsvValue).join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_export.csv`;
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
