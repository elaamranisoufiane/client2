import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
const modalHeaderButtonClasses =
    "ml-2 text-md outline-none py-1 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";

const ImageEditor = (
    allowColorEditing = true,
    allowFlip = true,
    allowRotate = true,
    allowZoom = true,
    allowAddText = true,
) => {
    const canvasRef = useRef(null);
    const [imageSrc, setImageSrc] = useState('');
    const [imageName, setImageName] = useState('');
    const [brightnessValue, setBrightnessValue] = useState(100);
    const [contrastValue, setContrastValue] = useState(100);
    const [saturateValue, setSaturateValue] = useState(100);
    const [grayscaleValue, setGrayscaleValue] = useState(0);
    const [rotate, setRotate] = useState(0);
    const [flipHorizontal, setFlipHorizontal] = useState(false);
    const [flipVertical, setFlipVertical] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [file, setFile] = useState(null);
    //Editing 
    const [texts, setTexts] = useState([]);
    const [currentText, setCurrentText] = useState({
        content: '',
        position: { x: 0, y: 0 },
        fontSize: 16,
        color: 'black',
        fontFamily: 'Arial',
    });

    const handleMouseMove = (e) => {
        if (currentText) {
            setCurrentText((prev) => ({ ...prev, position: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY } }));
        }
    };


    useEffect(() => {
        if (file) {
            const fileSrc = URL.createObjectURL(file);
            setImageSrc(fileSrc);
            setImageName(file.name);
            return () => {
                URL.revokeObjectURL(fileSrc);
            };
        }
    }, [file]);

    useEffect(() => {
        applyFilter();
    }, [file, imageSrc, rotate, flipHorizontal, flipVertical, zoom, brightnessValue, contrastValue, saturateValue, grayscaleValue]);

    const applyFilter = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            if (canvas && context) {
                const zoomedWidth = image.width * zoom;
                const zoomedHeight = image.height * zoom;
                const translateX = (image.width - zoomedWidth) / 2;
                const translateY = (image.height - zoomedHeight) / 2;
                canvas.width = image.width;
                canvas.height = image.height;
                context.filter = getFilterString();
                context.save();
                if (rotate) {
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    context.translate(centerX, centerY);
                    context.rotate((rotate * Math.PI) / 180);
                    context.translate(-centerX, -centerY);
                }
                if (flipHorizontal) {
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                }
                if (flipVertical) {
                    context.translate(0, canvas.height);
                    context.scale(1, -1);
                }
                context.translate(translateX, translateY);
                context.scale(zoom, zoom);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                //editing adding text  
                // Render all texts
                texts.forEach((text) => {
                    context.font = `${text.fontSize}px ${text.fontFamily}`;
                    context.fillStyle = text.color;
                    context.fillText(text.content, text.position.x, text.position.y);
                });

                //

                context.restore();
            }
        };
    };

    const getFilterString = () => {
        return `brightness(${brightnessValue}%) contrast(${contrastValue}%) grayscale(${grayscaleValue}%) saturate(${saturateValue}%)`;
    };

    const handleRotateChange = (event) => {
        setRotate(parseInt(event?.target?.value));
    };

    const handleZoomIn = () => {
        setZoom((prevZoom) => prevZoom + 0.1);
    };

    const handleZoomOut = () => {
        setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.1));
    };

    const resetImage = () => {
        setBrightnessValue(100);
        setContrastValue(100);
        setSaturateValue(100);
        setGrayscaleValue(0);
        setRotate(0);
        setFlipHorizontal(false);
        setFlipVertical(false);
        setZoom(1);
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.toBlob((blob) => {
                if (blob) {
                    const editedFile = new File([blob], imageName, { type: blob.type });
                    const objectUrl = URL.createObjectURL(blob);

                    const linkElement = document.createElement('a');
                    linkElement.download = `${imageName}`;
                    linkElement.href = objectUrl;
                    linkElement.click();
                    URL.revokeObjectURL(objectUrl);


                }
            });
            resetImage();
        }
    };

    const setFileData = (e) => {
        if (e?.target?.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    //menu animation 
    // to delete 
    const [adjustSubMenuOpen, setAdjustSubMenuOpen] = useState(false);

    const handleAdjustSubMenuClick = () => {
        setAdjustSubMenuOpen(!adjustSubMenuOpen);
    };

    return (


        <main className="max-w-3/4 h-full flex  flex-col items-center min-h-screen p-2">
            <div className="container bg-white p-10 rounded-lg  mx-auto flex-col">
                <h2 className="text-2xl font-semibold">Photo Editor</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {/* Left side menu */}
                    <div className="w-1/4 p-4 col-span-1">
                        <h1 className="text-2xl">Menu</h1>

                        <div className='flex'>
                            <div className="">
                                <button className={modalHeaderButtonClasses} onClick={() => setFile(null)} data-testid="save-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw dark:stroke-slate-200"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                                </button>
                            </div>

                            <div className="">
                                <button className={modalHeaderButtonClasses} onClick={() => saveImage()} data-testid="save-button">
                                    <div>
                                        <svg
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M3 14.25C3.41421 14.25 3.75 14.5858 3.75 15C3.75 16.4354 3.75159 17.4365 3.85315 18.1919C3.9518 18.9257 4.13225 19.3142 4.40901 19.591C4.68577 19.8678 5.07435 20.0482 5.80812 20.1469C6.56347 20.2484 7.56459 20.25 9 20.25H15C16.4354 20.25 17.4365 20.2484 18.1919 20.1469C18.9257 20.0482 19.3142 19.8678 19.591 19.591C19.8678 19.3142 20.0482 18.9257 20.1469 18.1919C20.2484 17.4365 20.25 16.4354 20.25 15C20.25 14.5858 20.5858 14.25 21 14.25C21.4142 14.25 21.75 14.5858 21.75 15V15.0549C21.75 16.4225 21.75 17.5248 21.6335 18.3918C21.5125 19.2919 21.2536 20.0497 20.6517 20.6516C20.0497 21.2536 19.2919 21.5125 18.3918 21.6335C17.5248 21.75 16.4225 21.75 15.0549 21.75H8.94513C7.57754 21.75 6.47522 21.75 5.60825 21.6335C4.70814 21.5125 3.95027 21.2536 3.34835 20.6517C2.74643 20.0497 2.48754 19.2919 2.36652 18.3918C2.24996 17.5248 2.24998 16.4225 2.25 15.0549C2.25 15.0366 2.25 15.0183 2.25 15C2.25 14.5858 2.58579 14.25 3 14.25Z" fill="#1C274C"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12 16.75C12.2106 16.75 12.4114 16.6615 12.5535 16.5061L16.5535 12.1311C16.833 11.8254 16.8118 11.351 16.5061 11.0715C16.2004 10.792 15.726 10.8132 15.4465 11.1189L12.75 14.0682V3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3V14.0682L8.55353 11.1189C8.27403 10.8132 7.79963 10.792 7.49393 11.0715C7.18823 11.351 7.16698 11.8254 7.44648 12.1311L11.4465 16.5061C11.5886 16.6615 11.7894 16.75 12 16.75Z" fill="#1C274C"></path> </g></svg>

                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex">
                            {/* Sidebar */}
                            {/** test side bar  */}


                            {/** end test  */}

                            <div className="absolute grid grid-cols-2">
                                {/* Adjust Menu */}
                                <div>
                                    <button
                                        id="palleon-btn-adjust"
                                        type="button"
                                        className={`${adjustSubMenuOpen ? 'bg-slate-400' : 'bg-transparent'}`}
                                        onClick={() => setAdjustSubMenuOpen(!adjustSubMenuOpen)}
                                    >
                                        <span className="material-icons">
                                            <span className="material-icons">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 124 124" fill="none">
                                                    <rect width="124" height="124" rx="24" fill="#F97316" />
                                                    <path d="M19.375 36.7818V100.625C19.375 102.834 21.1659 104.625 23.375 104.625H87.2181C90.7818 104.625 92.5664 100.316 90.0466 97.7966L26.2034 33.9534C23.6836 31.4336 19.375 33.2182 19.375 36.7818Z" fill="white" />
                                                    <circle cx="63.2109" cy="37.5391" r="18.1641" fill="black" />
                                                    <rect opacity="0.4" x="81.1328" y="80.7198" width="17.5687" height="17.3876" rx="4" transform="rotate(-45 81.1328 80.7198)" fill="#FDBA74" />
                                                </svg>

                                            </span>
                                            <span className="palleon-icon-menu-title">Adjust</span>
                                        </span>
                                    </button>
                                </div>
                                <div>
                                    {adjustSubMenuOpen && (
                                        <div className="ml-4 left-10">
                                            <div
                                                className={` top-0 left-20 bg-slate-400 p-4 transition-transform ease-in-out duration-300 transform`}
                                            >
                                                {allowRotate && (
                                                    <div className="flex flex-row items-center">
                                                        <label className="text-xs font-medium text-gray-900 dark:text-white">Rotate: </label>
                                                        <input
                                                            type="range"
                                                            value={rotate}
                                                            step="1"
                                                            onChange={handleRotateChange}
                                                            min={-180}
                                                            max={180}
                                                            className="ml-[1.8rem] w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={rotate}
                                                            onChange={handleRotateChange}
                                                            className="w-14 pl-1 rounded-md text-right"
                                                        />
                                                    </div>
                                                )}
                                                {allowColorEditing && (
                                                    <>
                                                        <div className="flex flex-row justify-between items-center" data-testid="color-editing">
                                                            <label className="text-xs font-medium text-gray-900 dark:text-white">Brightness: </label>
                                                            <input
                                                                id="default-range"
                                                                type="range"
                                                                step="1"
                                                                max={200}
                                                                value={brightnessValue}
                                                                onChange={(e) => setBrightnessValue(parseInt(e.target.value))}
                                                                className="ml-2 w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                                            />
                                                            <input
                                                                type="number"
                                                                value={brightnessValue}
                                                                onChange={(e) => setBrightnessValue(parseInt(e.target.value))}
                                                                className="w-14 pl-1 rounded-md text-right"
                                                            />
                                                        </div>
                                                        <div className="flex items-center">
                                                            <label className="text-xs font-medium text-gray-900 dark:text-white">Contrast: </label>
                                                            <input
                                                                id="default-range"
                                                                type="range"
                                                                step="1"
                                                                max={200}
                                                                value={contrastValue}
                                                                onChange={(e) => setContrastValue(parseInt(e.target.value))}
                                                                className="ml-[1.1rem] w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                                            />
                                                            <input
                                                                type="number"
                                                                value={contrastValue}
                                                                onChange={(e) => setContrastValue(parseInt(e.target.value))}
                                                                className="w-14 pl-1 rounded-md text-right"
                                                            />
                                                        </div>
                                                        <div className="flex items-center">
                                                            <label className="text-xs font-medium text-gray-900 dark:text-white">Saturate: </label>
                                                            <input
                                                                id="default-range"
                                                                type="range"
                                                                step="1"
                                                                max={200}
                                                                value={saturateValue}
                                                                onChange={(e) => setSaturateValue(parseInt(e.target.value))}
                                                                className="ml-[1.2rem] w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                                            />
                                                            <input
                                                                type="number"
                                                                value={saturateValue}
                                                                onChange={(e) => setSaturateValue(parseInt(e.target.value))}
                                                                className="w-14 pl-1 rounded-md text-right"
                                                            />
                                                        </div>
                                                        <div className="flex items-center">
                                                            <label className="text-xs font-medium text-gray-900 dark:text-white">Grayscale: </label>
                                                            <input
                                                                id="grayscaleSlider"
                                                                type="range"
                                                                value={grayscaleValue}
                                                                max="100"
                                                                onChange={(e) => setGrayscaleValue(parseInt(e.target.value))}
                                                                className="ml-[0.8rem] w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                                            />
                                                            <input
                                                                type="number"
                                                                value={grayscaleValue}
                                                                onChange={(e) => setGrayscaleValue(parseInt(e.target.value))}
                                                                className="w-14 pl-1 rounded-md text-right"
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                {allowAddText && (
                                                    <>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter text"
                                                                value={currentText.content}
                                                                onChange={(e) => setCurrentText((prev) => ({ ...prev, content: e.target.value }))}
                                                            /></div>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="number"
                                                                placeholder="Font Size"
                                                                value={currentText.fontSize}
                                                                onChange={(e) => setCurrentText((prev) => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                                                            /></div>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="color"
                                                                value={currentText.color}
                                                                onChange={(e) => setCurrentText((prev) => ({ ...prev, color: e.target.value }))}
                                                            /></div>
                                                        <div className="flex items-center">
                                                            <select
                                                                value={currentText.fontFamily}
                                                                onChange={(e) => setCurrentText((prev) => ({ ...prev, fontFamily: e.target.value }))}
                                                            >
                                                                <option value="Arial">Arial</option>
                                                                <option value="Times New Roman">Times New Roman</option>
                                                                {/* Add more font options as needed */}
                                                            </select></div>
                                                    </>
                                                )}
                                                <button onClick={() => setTexts('')}>Clear Text</button>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>




                        <div className=''>

                        </div>

                    </div>

                    {/* Main content */}
                    <div className="flex flex-col items-center justify-center p-4 col-span-3">

                        {!file ? (
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG, or GIF</p>
                                </div>
                                <input type="file" id="dropzone-file" accept="image/*" onChange={(e) => setFileData(e)} multiple={false} className="hidden" />
                            </label>
                        ) : (
                            <>
                                <canvas
                                    className="canvas max-w-full max-h-96 object-fit mx-auto"
                                    data-testid="image-editor-canvas"
                                    id="canvas"
                                    onMouseMove={handleMouseMove}
                                    ref={canvasRef} />

                                <div className="flex justify-center">
                                    <div className="mb-1 absolute bottom-0 mt-2">

                                        <button className="mx-1  focus:ring-4 rounded-md p-1" onClick={resetImage}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                className="lucide lucide-rotate-ccw dark:stroke-slate-200"
                                            >
                                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                                <path d="M3 3v5h5" />
                                            </svg>
                                        </button>
                                        {allowFlip && (
                                            <div className="inline-block" data-testid="flip-btns">
                                                <button className="mx-1 focus:ring-4 rounded-md p-1" onClick={() => setFlipHorizontal(!flipHorizontal)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-flip-horizontal dark:stroke-slate-200"
                                                    >
                                                        <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" />
                                                        <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
                                                        <path d="M12 20v2" />
                                                        <path d="M12 14v2" />
                                                        <path d="M12 8v2" />
                                                        <path d="M12 2v2" />
                                                    </svg>
                                                </button>
                                                <button className="mx-1 focus:ring-4 rounded-md p-1" onClick={() => setFlipVertical(!flipVertical)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-flip-vertical dark:stroke-slate-200"
                                                    >
                                                        <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                                                        <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
                                                        <path d="M4 12H2" />
                                                        <path d="M10 12H8" />
                                                        <path d="M16 12h-2" />
                                                        <path d="M22 12h-2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        {allowZoom && (
                                            <div className="inline-block" data-testid="zoom-btns">
                                                <button data-testid="zoom-in" className="mx-1 focus:ring-4 rounded-md p-1" onClick={handleZoomIn}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-zoom-in dark:stroke-slate-200"
                                                    >
                                                        <circle cx="11" cy="11" r="8" />
                                                        <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                                        <line x1="11" x2="11" y1="8" y2="14" />
                                                        <line x1="8" x2="14" y1="11" y2="11" />
                                                    </svg>
                                                </button>
                                                <button data-testid="zoom-out" className="mx-1 focus:ring-4 rounded-md p-1" onClick={handleZoomOut}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-zoom-out dark:stroke-slate-200"
                                                    >
                                                        <circle cx="11" cy="11" r="8" />
                                                        <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                                        <line x1="8" x2="14" y1="11" y2="11" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>





                </div>
            </div >
        </main >
    );
}

export default ImageEditor;