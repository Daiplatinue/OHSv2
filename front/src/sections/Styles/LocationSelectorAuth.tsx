"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, Search, Check, Cloud, CloudOff, Building } from "lucide-react"
import "ol/ol.css"
import { Map, View } from "ol"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import XYZ from "ol/source/XYZ"
import { fromLonLat, toLonLat } from "ol/proj"
import { Feature, Overlay } from "ol"
import { Point, Circle as GeomCircle } from "ol/geom"
import { Vector as VectorSource } from "ol/source"
import { Vector as VectorLayer } from "ol/layer"
import { Style, Circle, Fill, Stroke } from "ol/style"
import OutOfBoundaryModal from "../Styles/OutOfBoundary" // Updated import path
import { calculateDistance, isPointInCircle, reverseGeocode } from "../LocationUtils/LocationUtil" // Import from new utility file

interface Location {
  name: string
  lat: number
  lng: number
  distance: number
  price?: number
  id?: string
  zipCode?: string
}

interface LocationSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectLocation: (location: Location) => void
  companyLocation: {
    lat: number
    lng: number
  }
  savedLocations?: Location[]
  previousLocation?: Location | null
}

export default function LocationSelector({
  isOpen,
  onClose,
  onSelectLocation,
  companyLocation,
  savedLocations = [],
  previousLocation = null,
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [, setSearchResults] = useState<Location[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [selectedMapLocation, setSelectedMapLocation] = useState<Location | null>(previousLocation)
  const [savedLocationsList, setSavedLocationsList] = useState<Location[]>([])
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [notFound, setNotFound] = useState<boolean>(false)
  const [, setIsSearchBarFocused] = useState<boolean>(false)
  const [mapLayers, setMapLayers] = useState<string>("standard")
  const [isMapInitialized, setIsMapInitialized] = useState(false)
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)

  // Map refs
  const mapRef = useRef<Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const companyMarkerRef = useRef<Overlay | null>(null)

  // Ref for the single vector source that will hold all dynamic markers
  const allMarkersSourceRef = useRef(new VectorSource())
  const allMarkersLayerRef = useRef<VectorLayer<VectorSource> | null>(null)

  // Define Cebu City boundary parameters
  const cebuCityCenterLat = 10.3178 // Approx. Ayala Center Cebu
  const cebuCityCenterLng = 123.9054
  const cebuCityRadiusMeters = 7000 // Approx. 7km radius

  // Stable callback for reverse geocoding (now imported)
  const memoizedReverseGeocode = useCallback(reverseGeocode, [])

  // Stable callback for selecting a location item (updates state and centers map)
  const selectLocationItem = useCallback(
    (location: Location) => {
      setSelectedMapLocation(location)
      if (mapRef.current) {
        mapRef.current.getView().setCenter(fromLonLat([location.lng, location.lat]))
      }
    },
    [setSelectedMapLocation],
  )

  // Initial setup for saved locations list
  useEffect(() => {
    const cebuLocations = [
      {
        id: "loc-1",
        name: "Cebu City Downtown, Cebu, Philippines",
        lat: 10.2931,
        lng: 123.9017,
        distance: calculateDistance(10.2931, 123.9017, companyLocation.lat, companyLocation.lng),
        price: 0,
        zipCode: "6000",
      },
      {
        id: "loc-2",
        name: "Ayala Center Cebu, Cebu City, Philippines",
        lat: 10.3178,
        lng: 123.9054,
        distance: calculateDistance(10.3178, 123.9054, companyLocation.lat, companyLocation.lng),
        price: 0,
        zipCode: "6000",
      },
      {
        id: "loc-3",
        name: "SM City Cebu, Cebu City, Philippines",
        lat: 10.3114,
        lng: 123.9187,
        distance: calculateDistance(10.3114, 123.9187, companyLocation.lat, companyLocation.lng),
        price: 0,
        zipCode: "6000",
      },
      {
        id: "loc-4",
        name: "IT Park Cebu, Cebu City, Philippines",
        lat: 10.3308,
        lng: 123.906,
        distance: calculateDistance(10.3308, 123.906, companyLocation.lat, companyLocation.lng),
        price: 0,
        zipCode: "6000",
      },
      {
        id: "loc-5",
        name: "Fuente Osmeña Circle, Cebu City, Philippines",
        lat: 10.3116,
        lng: 123.8916,
        distance: calculateDistance(10.3116, 123.8916, companyLocation.lat, companyLocation.lng),
        price: 0,
        zipCode: "6000",
      },
    ]

    setSavedLocationsList(savedLocations.length ? savedLocations : cebuLocations)
  }, [savedLocations, companyLocation.lat, companyLocation.lng])

  // Map Initialization useEffect - runs once on mount
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const osmLayer = new TileLayer({
      source: new OSM(),
      visible: true,
    })
    osmLayer.set("name", "standard") // Set name for layer toggling

    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attributions: "Tiles © Esri",
        maxZoom: 19,
      }),
      visible: false,
    })
    satelliteLayer.set("name", "satellite") // Set name for layer toggling

    const buildingsLayer = new TileLayer({
      source: new XYZ({
        url: "https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        attributions: "© OpenStreetMap contributors, Humanitarian OpenStreetMap Team",
        maxZoom: 19,
      }),
      visible: false,
    })
    buildingsLayer.set("name", "buildings") // Set name for layer toggling

    // Create a feature for the circular boundary
    const cebuCityBoundaryFeature = new Feature({
      geometry: new GeomCircle(fromLonLat([cebuCityCenterLng, cebuCityCenterLat]), cebuCityRadiusMeters),
    })

    const boundarySource = new VectorSource({
      features: [cebuCityBoundaryFeature],
    })

    const boundaryLayer = new VectorLayer({
      source: boundarySource,
      style: new Style({
        stroke: new Stroke({
          color: "rgba(128, 128, 128, 0.7)", // Gray boundary line
          width: 3,
        }),
        fill: new Fill({
          color: "rgba(128, 128, 128, 0.1)", // Light gray transparent fill
        }),
      }),
      zIndex: 5,
    })
    boundaryLayer.set("name", "boundary") // Set name for layer toggling

    // Initialize the single markers layer
    allMarkersLayerRef.current = new VectorLayer({
      source: allMarkersSourceRef.current,
      style: (feature) => {
        const isSelected = feature.get("selected")
        return new Style({
          image: new Circle({
            radius: isSelected ? 10 : 8,
            fill: new Fill({
              color: isSelected ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.6)",
            }),
            stroke: new Stroke({
              color: "#ffffff",
              width: 2,
            }),
          }),
        })
      },
      zIndex: 10,
    })
    allMarkersLayerRef.current.set("name", "markers") // Set name for layer toggling

    // Determine initial center based on previousLocation or companyLocation
    const initialCenter = previousLocation
      ? fromLonLat([previousLocation.lng, previousLocation.lat])
      : fromLonLat([companyLocation.lng, companyLocation.lat])

    const map = new Map({
      target: mapContainerRef.current,
      layers: [osmLayer, satelliteLayer, buildingsLayer, boundaryLayer, allMarkersLayerRef.current], // Add allMarkersLayer
      view: new View({
        center: initialCenter, // Use the determined initial center
        zoom: 14,
      }),
      controls: [],
    })

    const companyMarkerElement = document.createElement("div")
    companyMarkerElement.className = "custom-company-marker"
    companyMarkerElement.innerHTML = `
      <div class="relative">
        <div class="h-6 w-6 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
          HG
        </div>
      </div>
    `

    const companyMarkerOverlay = new Overlay({
      element: companyMarkerElement,
      positioning: "center-center",
      stopEvent: false,
    })
    map.addOverlay(companyMarkerOverlay)
    companyMarkerOverlay.setPosition(fromLonLat([companyLocation.lng, companyLocation.lat]))
    companyMarkerRef.current = companyMarkerOverlay

    const style = document.createElement("style")
    style.textContent = `
      .custom-company-marker {
        background: transparent;
        border: none;
      }
      .ol-zoom {
        display: none;
      }
    `
    document.head.appendChild(style)

    // Consolidated click handler for map and markers
    map.on("click", (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        // Check if the clicked feature is a marker with location data
        if (feature.getGeometry() instanceof Point && feature.get("location")) {
          return feature
        }
        return undefined
      })

      if (feature && feature.get("location")) {
        // Clicked on an existing saved location marker
        const location = feature.get("location")
        selectLocationItem(location)
      } else {
        // Clicked on an empty map area
        const coordinate = evt.coordinate // This is already the projected coordinate
        const lonLat = toLonLat(coordinate) // Convert to LonLat

        const distance = calculateDistance(lonLat[1], lonLat[0], companyLocation.lat, companyLocation.lng)

        memoizedReverseGeocode(lonLat[1], lonLat[0]).then(({ name, zipCode }) => {
          const newLocation = {
            name: name || "Selected Location",
            lat: lonLat[1],
            lng: lonLat[0],
            distance: Math.round(distance * 10) / 10,
            price: 0,
            id: `search-${Math.random().toString(36).substr(2, 9)}`,
            zipCode,
          }
          setSelectedMapLocation(newLocation)
          // Center map on the newly clicked location
          mapRef.current?.getView().setCenter(coordinate) // Use the projected coordinate directly
        })
      }
    })

    mapRef.current = map
    setIsMapInitialized(true)

    // Cleanup function for map initialization
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined)
        mapRef.current = null
      }
      document.head.removeChild(style)
    }
  }, [
    companyLocation.lat,
    companyLocation.lng,
    selectLocationItem,
    memoizedReverseGeocode,
    cebuCityCenterLat,
    cebuCityCenterLng,
    cebuCityRadiusMeters,
    previousLocation, // Add previousLocation to dependencies to re-run if it changes
  ]) // Dependencies for map initialization.

  // Consolidated useEffect for managing all dynamic markers
  useEffect(() => {
    if (!isMapInitialized || !allMarkersSourceRef.current) return

    const featuresToAdd: Feature[] = []

    // Add saved locations
    savedLocationsList.forEach((location) => {
      // Only add if it's not the currently selected map location
      if (!selectedMapLocation || location.id !== selectedMapLocation.id) {
        featuresToAdd.push(
          new Feature({
            geometry: new Point(fromLonLat([location.lng, location.lat])),
            selected: false,
            location: location,
            id: location.id,
          }),
        )
      }
    })

    // Add selected map location marker
    if (selectedMapLocation) {
      featuresToAdd.push(
        new Feature({
          geometry: new Point(fromLonLat([selectedMapLocation.lng, selectedMapLocation.lat])),
          selected: true,
          id: "selected-marker",
        }),
      )
    }

    // Update the source: clear all existing features and add the new set
    allMarkersSourceRef.current.clear()
    allMarkersSourceRef.current.addFeatures(featuresToAdd)

    // The line to re-center the map on selectedMapLocation was intentionally removed from here
    // to allow free navigation after initial load/selection.
  }, [isMapInitialized, savedLocationsList, selectedMapLocation])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestions.length > 0 && !(event.target as Element).closest(".search-container")) {
        setSuggestions([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [suggestions])

  const handleSearchInput = (query: string) => {
    setSearchQuery(query)
    setNotFound(false)

    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    const words = query
      .trim()
      .split(" ")
      .filter((word) => word.length > 0)
    if (words.length > 0) {
      fetchSuggestions(words.join(" "))
    }
  }

  const fetchSuggestions = async (query: string) => {
    if (query.trim().length < 2) return

    try {
      setIsSearching(true)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ph&limit=5`,
      )
      const data = await response.json()

      if (data.length === 0) {
        setNotFound(true)
        setSuggestions([])
      } else {
        setNotFound(false)
        const results = data.map((item: any) => {
          const distance = calculateDistance(
            Number.parseFloat(item.lat),
            Number.parseFloat(item.lon),
            companyLocation.lat,
            companyLocation.lng,
          )
          let zipCode = ""
          if (item.address && item.address.postcode) {
            zipCode = item.address.postcode
          }
          return {
            name: item.display_name,
            lat: Number.parseFloat(item.lat),
            lng: Number.parseFloat(item.lon),
            distance: distance,
            price: 0,
            id: `search-${Math.random().toString(36).substr(2, 9)}`,
            zipCode,
          }
        })
        setSuggestions(results)
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }

  const searchLocation = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSuggestions([])

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=ph&city=Cebu&limit=5`,
      )
      const data = await response.json()

      if (data.length === 0) {
        setNotFound(true)
        setSearchResults([])
        return
      }

      const results = data.map((item: any) => {
        const distance = calculateDistance(
          Number.parseFloat(item.lat),
          Number.parseFloat(item.lon),
          companyLocation.lat,
          companyLocation.lng,
        )
        let zipCode = ""
        if (item.address && item.address.postcode) {
          zipCode = item.address.postcode
        }
        return {
          name: item.display_name,
          lat: Number.parseFloat(item.lat),
          lng: Number.parseFloat(item.lon),
          distance: distance,
          price: 0,
          id: `search-${Math.random().toString(36).substr(2, 9)}`,
          zipCode,
        }
      })
      setSearchResults(results)
      setNotFound(false)
    } catch (error) {
      console.error("Error searching location:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const confirmSelection = () => {
    if (selectedMapLocation) {
      const isWithinBoundary = isPointInCircle(
        selectedMapLocation.lat,
        selectedMapLocation.lng,
        cebuCityCenterLat,
        cebuCityCenterLng,
        cebuCityRadiusMeters,
      )

      if (isWithinBoundary) {
        onSelectLocation(selectedMapLocation)
        onClose()
      } else {
        setIsWarningModalOpen(true)
      }
    }
  }

  const handleContactCustomerService = () => {
    console.log("Contacting customer service...")
    setIsWarningModalOpen(false)
  }

  const changeMapLayer = (layerName: string) => {
    setMapLayers(layerName)
    if (mapRef.current) {
      mapRef.current.getLayers().forEach((lyr) => {
        // Only toggle visibility for the main tile layers
        if (lyr.get("name") === "standard" || lyr.get("name") === "satellite" || lyr.get("name") === "buildings") {
          lyr.setVisible(lyr.get("name") === layerName)
        }
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[645px] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-medium text-gray-700">Select your service location</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col h-full">
            {/* Search bar */}
            <div className="p-3 border-b border-gray-100 relative search-container">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Search by address"
                  className="w-full p-2 pl-9 bg-gray-50 border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && searchLocation()}
                  onFocus={() => {
                    setIsSearchBarFocused(true)
                    if (searchQuery.trim().length >= 2) {
                      const words = searchQuery
                        .trim()
                        .split(" ")
                        .filter((word) => word.length > 0)
                      if (words.length > 0) {
                        fetchSuggestions(words.join(" "))
                      }
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsSearchBarFocused(false), 200)
                  }}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={searchLocation}
                  disabled={isSearching}
                  className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => changeMapLayer("standard")}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${
                    mapLayers === "standard"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <CloudOff className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => changeMapLayer("satellite")}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${
                    mapLayers === "satellite"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Cloud className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => changeMapLayer("buildings")}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${
                    mapLayers === "buildings"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Building className="h-3.5 w-3.5" />
                </button>
              </div>

              {notFound && suggestions.length === 0 && searchQuery.trim().length > 0 && (
                <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm">
                  Location not found. Please try a different search.
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 left-3 right-3 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => {
                        selectLocationItem(suggestion)
                        setSuggestions([])
                        setSearchQuery(suggestion.name.split(",")[0])
                      }}
                    >
                      <div className="font-medium text-sm">{suggestion.name.split(",")[0]}</div>
                      <div className="text-xs text-gray-500 truncate">{suggestion.name}</div>
                      {suggestion.zipCode && <div className="text-xs text-sky-600 mt-1">ZIP: {suggestion.zipCode}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button className="flex-1 py-2 px-4 bg-blue-50 text-blue-600 font-medium border-b-2 border-blue-500">
                Saved Locations
              </button>
            </div>

            {/* Saved Locations list */}
            <div className="flex-1 overflow-y-auto h-[calc(100%-110px)]">
              {savedLocationsList.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No saved locations yet. Search or click on the map to select a location.</p>
                </div>
              ) : (
                savedLocationsList.map((location) => (
                  <div
                    key={`saved-${location.id}`}
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedMapLocation && selectedMapLocation.id === location.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => selectLocationItem(location)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{location.name.split(",")[0]}</h3>
                        <p className="text-gray-500 text-sm mt-1">{location.distance.toFixed(1)} km from company</p>
                        {location.zipCode && <p className="text-xs text-sky-600 mt-0.5">ZIP: {location.zipCode}</p>}
                      </div>
                      {selectedMapLocation && selectedMapLocation.id === location.id && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Map */}
          <div className="w-2/3 relative">
            <div className="h-full w-full relative">
              <div ref={mapContainerRef} className="h-full w-full"></div>

              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                  onClick={() =>
                    mapRef.current?.getView().animate({
                      zoom: mapRef.current.getView().getZoom()! + 1,
                      duration: 250,
                    })
                  }
                >
                  <span className="text-gray-800 font-bold">+</span>
                </button>
                <button
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                  onClick={() =>
                    mapRef.current?.getView().animate({
                      zoom: mapRef.current.getView().getZoom()! - 1,
                      duration: 250,
                    })
                  }
                >
                  <span className="text-gray-800 font-bold">-</span>
                </button>
              </div>

              {/* Loading indicator */}
              {!isMapInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={confirmSelection}
            disabled={!selectedMapLocation}
            className={`w-full py-2 rounded-md transition-colors font-medium ${
              selectedMapLocation
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Confirm Location
          </button>
        </div>
      </div>

      {/* Out of Boundary Warning Modal */}
      <OutOfBoundaryModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        onContactCustomerService={handleContactCustomerService}
      />
    </div>
  )
}
