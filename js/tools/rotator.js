// WebP Rotator Tool
(function() {
    // Load JSZip dynamically
    const loadJSZip = () => {
        return new Promise((resolve, reject) => {
            if (window.JSZip) {
                resolve(window.JSZip);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => resolve(window.JSZip);
            script.onerror = () => reject(new Error('Failed to load JSZip'));
            document.head.appendChild(script);
        });
    };

    // Global variables
    const images = [];
    let imageCounter = 0;
    
    // DOM elements
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const previewArea = document.getElementById('preview-area');
    const rotateAllCW = document.getElementById('rotate-all-cw');
    const rotateAllCCW = document.getElementById('rotate-all-ccw');
    const rotateAll180 = document.getElementById('rotate-all-180');
    const downloadAllBtn = document.getElementById('download-all');
    
    // Load JSZip
    loadJSZip().catch(error => {
        console.error('JSZip loading error:', error);
        alert('Failed to load required library. Please try refreshing the page.');
    });
    
    // Event listeners
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop handlers
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('active');
    });
    
    dropArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('active');
    });
    
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('active');
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Click on drop area
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });
    rotateAllCW.addEventListener('click', () => rotateAllImages(90));
    rotateAllCCW.addEventListener('click', () => rotateAllImages(-90));
    rotateAll180.addEventListener('click', () => rotateAllImages(180));
    downloadAllBtn.addEventListener('click', downloadAllImages);
    
    // Functions
    function handleFileSelect(event) {
        if (event.target.files && event.target.files.length > 0) {
            handleFiles(event.target.files);
        }
    }
    
    function handleFiles(files) {
        if (files.length === 0) return;
        
        previewArea.innerHTML = '';
        images.length = 0;
        imageCounter = 0;
        
        Array.from(files).forEach(file => {
            if (!file.type.includes('webp')) {
                console.warn(`File ${file.name} is not a WebP image.`);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgSrc = e.target.result;
                const img = new Image();
                
                img.onload = function() {
                    const imageId = imageCounter++;
                    
                    // Create image data object
                    const imageData = {
                        id: imageId,
                        filename: file.name,
                        originalImg: img,  // Keep reference to the original image
                        originalSrc: imgSrc,
                        currentRotation: 0,
                        width: img.width,
                        height: img.height
                    };
                    
                    images.push(imageData);
                    createImagePreview(imageData);
                };
                
                img.src = imgSrc;
            };
            
            reader.readAsDataURL(file);
        });
        
        // Enable download button if images were loaded
        if (files.length > 0) {
            downloadAllBtn.disabled = false;
            document.querySelector('.empty-state')?.remove();
        }
    }
    
    function createImagePreview(imageData) {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'image-preview';
        previewDiv.id = `image-${imageData.id}`;
        
        const nameElement = document.createElement('p');
        nameElement.textContent = imageData.filename;
        
        const img = document.createElement('img');
        img.src = imageData.originalSrc;
        
        const rotationControls = document.createElement('div');
        rotationControls.className = 'rotation-controls';
        
        const rotateCCWBtn = document.createElement('button');
        rotateCCWBtn.textContent = '↺ 90°';
        rotateCCWBtn.onclick = () => rotateImage(imageData.id, -90);
        
        const rotate180Btn = document.createElement('button');
        rotate180Btn.textContent = '↻↺ 180°';
        rotate180Btn.onclick = () => rotateImage(imageData.id, 180);
        
        const rotateCWBtn = document.createElement('button');
        rotateCWBtn.textContent = '↻ 90°';
        rotateCWBtn.onclick = () => rotateImage(imageData.id, 90);
        
        rotationControls.appendChild(rotateCCWBtn);
        rotationControls.appendChild(rotate180Btn);
        rotationControls.appendChild(rotateCWBtn);
        
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = () => downloadImage(imageData.id);
        
        previewDiv.appendChild(nameElement);
        previewDiv.appendChild(img);
        previewDiv.appendChild(rotationControls);
        previewDiv.appendChild(downloadBtn);
        
        previewArea.appendChild(previewDiv);
    }
    
    function rotateImage(id, degrees) {
        const imageData = images.find(img => img.id === id);
        if (!imageData) return;
        
        // Update rotation state
        imageData.currentRotation = (imageData.currentRotation + degrees) % 360;
        if (imageData.currentRotation < 0) imageData.currentRotation += 360;
        
        // Get dimensions
        const { width, height } = imageData;
        
        // Check if we need to swap dimensions
        const needsSwap = imageData.currentRotation % 180 !== 0;
        
        // Create canvas for rotation
        const canvas = document.createElement('canvas');
        if (needsSwap) {
            canvas.width = height;
            canvas.height = width;
        } else {
            canvas.width = width;
            canvas.height = height;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Apply rotation transformation
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((imageData.currentRotation * Math.PI) / 180);
        ctx.drawImage(imageData.originalImg, -width / 2, -height / 2);
        
        // Update the preview
        const previewImg = document.querySelector(`#image-${id} img`);
        const rotatedImageData = canvas.toDataURL('image/webp');
        previewImg.src = rotatedImageData;
        
        // Store the rotated image data for download
        imageData.rotatedImageData = rotatedImageData;
    }
    
    function rotateAllImages(degrees) {
        images.forEach(image => rotateImage(image.id, degrees));
    }
    
    function downloadImage(id) {
        const imageData = images.find(img => img.id === id);
        if (!imageData) return;
        
        const link = document.createElement('a');
        link.download = `rotated_${imageData.filename}`;
        
        // Use rotated image data if available, otherwise use original
        link.href = imageData.rotatedImageData || imageData.originalSrc;
        link.click();
    }
    
    async function downloadAllImages() {
        if (images.length === 0) return;
        
        if (images.length === 1) {
            downloadImage(images[0].id);
            return;
        }
        
        try {
            // Get JSZip instance
            const JSZip = await loadJSZip();
            
            // Create zip file
            const zip = new JSZip();
            
            images.forEach(imageData => {
                // Get image data URL (rotated or original)
                const dataUrl = imageData.rotatedImageData || imageData.originalSrc;
                
                // Convert data URL to blob
                const byteString = atob(dataUrl.split(',')[1]);
                const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
                const arrayBuffer = new ArrayBuffer(byteString.length);
                const uint8Array = new Uint8Array(arrayBuffer);
                
                for (let i = 0; i < byteString.length; i++) {
                    uint8Array[i] = byteString.charCodeAt(i);
                }
                
                const blob = new Blob([arrayBuffer], { type: mimeType });
                zip.file(`rotated_${imageData.filename}`, blob);
            });
            
            // Generate and download the zip file
            const blob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.download = 'rotated_webp_images.zip';
            link.href = URL.createObjectURL(blob);
            link.click();
            
            // Cleanup
            setTimeout(() => {
                URL.revokeObjectURL(link.href);
            }, 100);
        } catch (error) {
            console.error('Error creating zip file:', error);
            alert('Failed to create zip file. Please try downloading images individually.');
        }
    }
})();