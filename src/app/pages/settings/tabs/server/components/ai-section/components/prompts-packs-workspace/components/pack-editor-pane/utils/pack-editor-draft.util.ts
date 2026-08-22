import type { CustomPackSettings } from '../../../../metadata-packs/interfaces/custom-pack-settings.interface';
import type { PackEditorDraft } from '../interfaces/pack-editor-draft.interface';
import type { PackEditorFieldDraft } from '../interfaces/pack-editor-field-draft.interface';
import { parseCommaSeparatedList } from '../../../utils/parse-comma-separated-list.util';

export function toPackEditorDraft(pack: CustomPackSettings): PackEditorDraft {
  return {
    id: pack.Id,
    label: pack.Label,
    description: pack.Description,
    promptFragment: pack.PromptFragment,
    categoriesText: pack.Match.Categories.join(', '),
    titleKeywordsText: (pack.Match.TitleKeywords ?? []).join(', '),
    fields: pack.Fields.map((field) => ({
      key: field.Key,
      label: field.Label,
      bucket: field.Bucket === 'predefined' ? 'predefined' : 'userDefined',
      hint: field.Hint ?? '',
    })),
  };
}

export function emptyPackEditorField(): PackEditorFieldDraft {
  return {
    key: '',
    label: '',
    bucket: 'userDefined',
    hint: '',
  };
}

export function toCustomPackSettingsFromDraft(
  draft: PackEditorDraft,
  packId: string
): CustomPackSettings {
  const titleKeywords = parseCommaSeparatedList(draft.titleKeywordsText);
  return {
    Id: packId,
    Label: draft.label.trim(),
    Description: draft.description.trim(),
    Match: {
      Categories: parseCommaSeparatedList(draft.categoriesText),
      ...(titleKeywords.length > 0 ? { TitleKeywords: titleKeywords } : {}),
    },
    Fields: draft.fields
      .map((field) => ({
        Key: field.key.trim(),
        Label: field.label.trim(),
        Bucket: field.bucket,
        ...(field.hint.trim() ? { Hint: field.hint.trim() } : {}),
      }))
      .filter((field) => field.Key.length > 0 || field.Label.length > 0),
    PromptFragment: draft.promptFragment,
  };
}
