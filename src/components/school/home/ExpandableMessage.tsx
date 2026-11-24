'use client';

import { useState } from 'react';

/** Shows the first paragraph of a message and lets the reader open the rest in place. */
export default function ExpandableMessage({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(false);
  if (paragraphs.length === 0) return null;
  const shown = open ? paragraphs : paragraphs.slice(0, 1);

  return (
    <>
      <div className="nb-msg" id="principal-message">
        {shown.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {paragraphs.length > 1 && (
        <button
          type="button"
          className="nb-toggle"
          aria-expanded={open}
          aria-controls="principal-message"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Show less' : 'Show more of the message'}
        </button>
      )}
    </>
  );
}
