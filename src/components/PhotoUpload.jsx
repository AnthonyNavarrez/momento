import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import './PhotoUpload.css'

export default function PhotoUpload({ lat, lng, open = true, onClose, onUploadSuccess }) {
	const [file, setFile] = useState(null)
	const [caption, setCaption] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!open) {
			setFile(null)
			setCaption('')
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
		setError(null)

		const formData = new FormData()
		if (file) formData.append('photo', file)
		if (lat !== undefined && lat !== null) formData.append('lat', String(lat))
		if (lng !== undefined && lng !== null) formData.append('lng', String(lng))
		formData.append('caption', caption || '')

		setIsLoading(true)
		try {
			const res = await api.post('/photos', formData)
			setIsLoading(false)
			if (onUploadSuccess) onUploadSuccess(res.data)
			if (onClose) onClose()
		} catch (err) {
			setIsLoading(false)
			setError(err?.response?.data?.message || err.message || 'Upload failed')
		}
	}

	return (
		<div className="photo-upload-overlay">
			<div className="photo-upload-modal" role="dialog" aria-modal="true" aria-label="Upload photo">
				<form className="photo-upload-form" onSubmit={handleSubmit}>
					<h2>Add Photo</h2>

					<div className="form-row">
						<label>Location</label>
						<div className="location-display">{lat}, {lng}</div>
					</div>

					<div className="form-row">
						<label htmlFor="photo-file">Photo</label>
						<input id="photo-file" type="file" accept="image/*" onChange={handleFileChange} />
						{file && <div className="file-name">{file.name}</div>}
					</div>

					<div className="form-row">
						<label htmlFor="caption">Caption (optional)</label>
						<input
							id="caption"
							type="text"
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							placeholder="Add a caption"
						/>
					</div>

					{error && <div className="error-message" role="alert">{error}</div>}

					<div className="form-actions">
						<button type="button" className="btn btn-cancel" onClick={onClose} disabled={isLoading}>Cancel</button>
						<button type="submit" className="btn btn-submit" disabled={isLoading}>
							{isLoading ? 'Uploading...' : 'Submit'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

