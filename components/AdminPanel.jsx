'use client';
import { useState, useTransition } from 'react';
import { setListingStatus, resolveClaim, savePost, deletePost } from '../app/admin/actions';

export default function AdminPanel({ pendingListings, pendingClaims, posts, allListings, messages = [], subscriberCount = 0 }) {
  const [tab, setTab] = useState('approvals');
  const [isPending, startTransition] = useTransition();
  const [editingPost, setEditingPost] = useState(null);

  const tabs = [
    { id: 'approvals', label: `Approvals (${pendingListings.length + pendingClaims.length})` },
    { id: 'listings', label: `All listings (${allListings.length})` },
    { id: 'blog', label: `Blog (${posts.length})` },
    { id: 'inbox', label: `Inbox (${messages.length})` }
  ];

  return (
    <div className="mt-8">
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t.id
                ? 'border-b-2 border-sea-600 text-sea-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isPending && <p className="mt-4 text-sm text-slate-400">Working…</p>}

      {/* ============ APPROVALS ============ */}
      {tab === 'approvals' && (
        <div className="mt-6 space-y-8">
          <section>
            <h2 className="font-semibold text-slate-900">New listings awaiting approval</h2>
            {pendingListings.length === 0 && (
              <p className="mt-2 text-sm text-slate-500">Nothing pending. 🎉</p>
            )}
            <div className="mt-3 space-y-3">
              {pendingListings.map((l) => (
                <div key={l.id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{l.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {l.categories?.name} · by {l.profiles?.full_name || l.profiles?.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startTransition(() => setListingStatus(l.id, 'published'))}
                        className="btn-primary !px-4 !py-2"
                      >
                        Approve & publish
                      </button>
                      <button
                        onClick={() => startTransition(() => setListingStatus(l.id, 'archived'))}
                        className="btn-secondary !border-red-300 !px-4 !py-2 !text-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-600">{l.description}</p>
                  {l.address && <p className="mt-1 text-xs text-slate-400">📍 {l.address}</p>}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900">Claim requests</h2>
            {pendingClaims.length === 0 && (
              <p className="mt-2 text-sm text-slate-500">No claims pending.</p>
            )}
            <div className="mt-3 space-y-3">
              {pendingClaims.map((c) => (
                <div key={c.id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {c.listings?.name}
                        <span className="ml-2 text-xs font-normal text-slate-400">
                          claimed by {c.profiles?.full_name || c.profiles?.email}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{c.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startTransition(() => resolveClaim(c.id, true))}
                        className="btn-primary !px-4 !py-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => startTransition(() => resolveClaim(c.id, false))}
                        className="btn-secondary !border-red-300 !px-4 !py-2 !text-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ============ ALL LISTINGS ============ */}
      {tab === 'listings' && (
        <div className="mt-6 space-y-2">
          {allListings.map((l) => (
            <div key={l.id} className="card flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
              <div>
                <span className="font-medium text-slate-900">{l.name}</span>
                <span className="ml-2 text-xs text-slate-400">
                  {l.categories?.name} · {l.status}
                  {l.claimed ? ' · claimed' : ''}
                  {l.featured ? ' · ⭐ featured' : ''}
                </span>
              </div>
              <div className="flex gap-2">
                {l.status !== 'published' ? (
                  <button
                    onClick={() => startTransition(() => setListingStatus(l.id, 'published'))}
                    className="text-sea-700 underline"
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    onClick={() => startTransition(() => setListingStatus(l.id, 'archived'))}
                    className="text-red-600 underline"
                  >
                    Unpublish
                  </button>
                )}
                <a href={`/listing/${l.slug}`} className="text-slate-500 underline">View</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============ INBOX ============ */}
      {tab === 'inbox' && (
        <div className="mt-6">
          <p className="text-sm text-slate-500">
            Newsletter subscribers: <strong>{subscriberCount}</strong> (export the full list from
            Supabase → Table Editor → subscribers)
          </p>
          <h2 className="mt-6 font-semibold text-slate-900">Contact messages</h2>
          {messages.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">No messages yet.</p>
          )}
          <div className="mt-3 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-slate-900">
                    {m.name || 'Anonymous'}
                    <a href={`mailto:${m.email}`} className="ml-2 text-sm font-normal text-sea-700 underline">
                      {m.email}
                    </a>
                  </p>
                  <span className="text-xs text-slate-400">
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ BLOG ============ */}
      {tab === 'blog' && (
        <div className="mt-6">
          <PostEditor
            key={editingPost?.id || 'new'}
            post={editingPost}
            onDone={() => setEditingPost(null)}
          />
          <h2 className="mt-10 font-semibold text-slate-900">All articles</h2>
          <div className="mt-3 space-y-2">
            {posts.map((p) => (
              <div key={p.id} className="card flex items-center justify-between p-4 text-sm">
                <div>
                  <span className="font-medium text-slate-900">{p.title}</span>
                  <span className="ml-2 text-xs text-slate-400">
                    {p.published ? 'published' : 'draft'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditingPost(p)} className="text-sea-700 underline">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this article?')) startTransition(() => deletePost(p.id));
                    }}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PostEditor({ post, onDone }) {
  const [isPending, startTransition] = useTransition();

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          if (!formData.get('slug')) formData.set('slug', slugify(formData.get('title')));
          await savePost(formData);
          onDone?.();
        })
      }
      className="card space-y-4 p-6"
    >
      <h2 className="font-semibold text-slate-900">
        {post ? `Edit: ${post.title}` : 'Write a new article'}
      </h2>
      {post && <input type="hidden" name="id" value={post.id} />}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Title *</label>
          <input name="title" defaultValue={post?.title} className="input" required />
        </div>
        <div>
          <label className="label">Slug (URL)</label>
          <input name="slug" defaultValue={post?.slug} className="input" placeholder="auto-generated" />
        </div>
      </div>
      <div>
        <label className="label">Excerpt (shown in previews)</label>
        <input name="excerpt" defaultValue={post?.excerpt} className="input" />
      </div>
      <div>
        <label className="label">Cover image URL</label>
        <input name="cover_image" defaultValue={post?.cover_image} className="input" placeholder="https://…" />
      </div>
      <div>
        <label className="label">Content (Markdown, # headings, **bold**, [links](url))</label>
        <textarea name="content" defaultValue={post?.content} rows={12} className="input font-mono text-xs" />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="published" defaultChecked={post?.published} />
        Published
      </label>
      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Saving…' : 'Save article'}
        </button>
        {post && (
          <button type="button" onClick={onDone} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
