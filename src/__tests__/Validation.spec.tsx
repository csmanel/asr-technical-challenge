const validate = (status: string, note: string): string | null => {
  if ((status === 'flagged' || status === 'needs_revision') && !note.trim()) {
    return 'A note is required';
  }
  return null 
}

describe('Validation', () => {
  it('requires note for flagged status', () => {
    expect(validate('flagged', '')).not.toBeNull();
  });

  it('requires note for needs_revision status', () => {
    expect(validate('needs_revision', '')).not.toBeNull();
  });

  it('allows approved without note', () => {
    expect(validate('approved', '')).toBeNull();
  });

  it('allows flagged with note', () => {
    expect(validate('flagged', 'reason here')).toBeNull();
  });
});