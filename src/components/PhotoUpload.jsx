import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { TagInput } from './TagInput'
import './PhotoUpload.css'

const SUGGESTED_TAGS = [
	'food', 'sunset', 'beach', 'hiking', 'nightlife',
	'coffee', 'street art', 'architecture', 'nature', 'sports',
	'shopping', 'music', 'hidden gem', 'rooftop', 'brunch',
]

export default function PhotoUpload({ lat, lng, open = true, onClose, onUploadSuccess }) {
	const [file, setFile] = useState(null)
	const [caption, setCaption] = useState('')
	const [tags, setTags] = useState([])
	const [isPublic, setIsPublic] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!open) {
			setFile(null)
			setCaption('')
			setTags([])
			setIsPublic(false)
			setError(null)
			setIsLoading(false)
		}
	}, [open])

	if (!open) return null

	const handleFileChange = (e) => {
		const f = e.target.files && e.target.files[0]
		setFile(f)
		setError(null)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (isLoading) return
		setError(null)

		if (!file) {
			setError('Please select a photo to upload.')
			return
		}

		if (lat == null || lng == null) {
			setError('Please click the map to choose a location first.')
			return
		}

		const formData = new FormData()
		formData.append('photo', file)
		formData.append('lat', String(lat))
		formData.append('lng', String(lng))
		formData.append('caption', caption || '')
		if (tags.length > 0) formData.append('tags', JSON.stringify(tags))
		if (isPublic) formData.append('isPublic', 'true')

		setIsLoading(true)
		try {
			const res = await api.post('/photos', formData)
			setIsLoading(false)
			try {
				if (onUploadSuccess) onUploadSuccess(res.data)
			} catch (cbErr) {
				console.error('onUploadSuccess callback error', cbErr)
			}
			if (onClose) onClose()
		} catch (err) {
			setIsLoading(false)
			const data = err?.response?.data
			const msg = data?.message || err.message || 'Upload failed'
			console.error('Upload failed', err)
			setError(msg)
		}
	}

	const handleDropzoneClick = () => {
		document.getElementById('photo-file').click()
	}

	return (
		<div className="photo-upload-overlay" onClick={(e) => {
			if (e.target === e.currentTarget && onClose) onClose()
		}}>
			<div className="photo-upload-modal" role="dialog" aria-modal="true" aria-label="Upload photo" onClick={(e) => e.stopPropagation()}>
				<form className="photo-upload-form" onSubmit={handleSubmit}>
					<h2>Upload Photo</h2>

					<div className="form-row">
						<label>Location</label>
						<div className="location-display">📍 {lat}, {lng}</div>
					</div>

					<div className="form-row">
						<label>Photo</label>
						<div
							className="photo-upload-dropzone"
							onClick={handleDropzoneClick}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDropzoneClick() }}
						>
							<span className="photo-upload-dropzone-icon">📷</span>
							<span className="photo-upload-dropzone-text">
								{file ? file.name : 'Click to select a photo'}
							</span>
							<input id="photo-file" type="file" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
						</div>
					</div>

					<div className="form-row">
						<label htmlFor="caption">Caption (optional)</label>
						<input
							id="caption"
							type="text"
							className="input"
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							placeholder="Add a caption"
							disabled={isLoading}
						/>
					</div>

					<div className="form-row">
						<label>Tags (optional)</label>
						<TagInput tags={tags} onChange={setTags} suggestions={SUGGESTED_TAGS} />
					</div>

					<div className="form-row form-row-checkbox">
						<label htmlFor="is-public">
							<input
								id="is-public"
								type="checkbox"
								checked={isPublic}
								onChange={(e) => setIsPublic(e.target.checked)}
								disabled={isLoading}
							/>
							Share publicly
						</label>
					</div>

					{error && <div className="error-message" role="alert">{error}</div>}

					<div className="form-actions">
						<button type="button" className="btn btn-outline" onClick={onClose} disabled={isLoading}>Cancel</button>
						<button type="submit" className="btn btn-primary" disabled={isLoading || !file}>
							{isLoading && <span className="spinner" aria-hidden="true" />}
							{isLoading ? 'Uploading...' : 'Upload'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

