import './App.css'
import React, { useState, useEffect } from 'react'
import {Html5Qrcode} from 'html5-qrcode'


let html5QrCode

function App() {

	const [toggleCamera, setToggleCamera] = useState(false)
	const [scanValue, setScanValue] = useState(null)
	// eslint-disable-next-line no-unused-vars
	const [error, setError] = useState(null)

	let cameraId = null

	useEffect(() => {

		html5QrCode = new Html5Qrcode('reader', {
			experimentalFeatures: {
				useBarCodeDetectorIfSupported: true
			}
		})
	}, [])

	const handleToggleScanner = () => {

		Html5Qrcode.getCameras().then(devices => {

			if (devices && devices.length) {
				cameraId = devices[0].id
			}
		}).catch(err => {
			setError(err)
		}).then(() => {
			if(toggleCamera){
				handleStopScanner(html5QrCode)
			}else{
				handleStartScanner(html5QrCode)
			}
		})
	}

	const handleStartScanner = (scanner) => {

		setToggleCamera(true)
		scanner.start(
			cameraId,
			{
				fps: 10,    // Optional, frame per seconds for qr code scanning
				qrbox: {width: 250, height: 250}  // Optional, if you want bounded box UI
			},
			(decodedText) => {
				setToggleCamera(false)
				setScanValue(decodedText)
				handleStopScanner(scanner)
			},
			(errorMessage) => {
				setError(errorMessage)
			})
	}

	const handleStopScanner = (scanner) => {
		setToggleCamera(false)

		try {
			scanner
				.stop()
				// eslint-disable-next-line no-unused-vars
				.then((res) => {
					scanner.clear()
				})
				.catch((err) => {
					console.log(err.message)
				})
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className="App">
			<h2 className='main-header'> B<span className='biq-logo'>!Q</span> Scanner Test</h2>
			<h3>Camera is: {toggleCamera ? <span className='camera-on'>ON</span> : <span className='camera-off'>OFF</span>}</h3>
			{toggleCamera ? <button className='start-scan-button' onClick={() => handleToggleScanner()}>Stop scanner</button>
				: <button className='start-scan-button' onClick={() => handleToggleScanner()}>Start scanner</button>
			}
			{scanValue && <h4 className='scan-value'><span className='camera-on'>Result: </span>{scanValue}</h4>}
			<div id="reader"></div>

		</div>
	)
}

export default App
