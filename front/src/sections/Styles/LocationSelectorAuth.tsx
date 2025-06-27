import { useState, useEffect, useRef } from "react"
import { X, Search, Check, Cloud, CloudOff, Building } from "lucide-react"
import "ol/ol.css"
import { Map, View } from "ol"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import XYZ from "ol/source/XYZ"
import { fromLonLat, toLonLat } from "ol/proj"
import { Feature, Overlay } from "ol"
import { Point } from "ol/geom"
import { Vector as VectorSource } from "ol/source"
import { Vector as VectorLayer } from "ol/layer"
import { Style, Circle, Fill, Stroke } from "ol/style"

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

  // Map refs
  const mapRef = useRef<Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const companyMarkerRef = useRef<Overlay | null>(null)
  const selectedMarkerRef = useRef<Feature | null>(null)
  const markersLayerRef = useRef<VectorLayer<VectorSource> | null>(null)

  useEffect(() => {
    const cebuLocations = [
      {
        id: "loc-1",
        name: "Cebu City Downtown, Cebu, Philippines",
        lat: 10.2931,
        lng: 123.9017,
        distance: calculateDistance(10.2931, 123.9017, companyLocation.lat, companyLocation.lng),
        price: 0, // Price will be calculated by parent component
        zipCode: "6000",
      },
      {
        id: "loc-2",
        name: "Ayala Center Cebu, Cebu City, Philippines",
        lat: 10.3178,
        lng: 123.9054,
        distance: calculateDistance(10.3178, 123.9054, companyLocation.lat, companyLocation.lng),
        price: 0, // Price will be calculated by parent component
        zipCode: "6000",
      },
      {
        id: "loc-3",
        name: "SM City Cebu, Cebu City, Philippines",
        lat: 10.3114,
        lng: 123.9187,
        distance: calculateDistance(10.3114, 123.9187, companyLocation.lat, companyLocation.lng),
        price: 0, // Price will be calculated by parent component
        zipCode: "6000",
      },
      {
        id: "loc-4",
        name: "IT Park Cebu, Cebu City, Philippines",
        lat: 10.3308,
        lng: 123.906,
        distance: calculateDistance(10.3308, 123.906, companyLocation.lat, companyLocation.lng),
        price: 0, // Price will be calculated by parent component
        zipCode: "6000",
      },
      {
        id: "loc-5",
        name: "Fuente Osmeña Circle, Cebu City, Philippines",
        lat: 10.3116,
        lng: 123.8916,
        distance: calculateDistance(10.3116, 123.8916, companyLocation.lat, companyLocation.lng),
        price: 0, // Price will be calculated by parent component
        zipCode: "6000",
      },
    ]

    setSavedLocationsList(savedLocations.length ? savedLocations : cebuLocations)
  }, [savedLocations, companyLocation.lat, companyLocation.lng])

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Standard OSM layer
    const osmLayer = new TileLayer({
      source: new OSM(),
      visible: true,
    })

    // Satellite layer
    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attributions: "Tiles © Esri",
        maxZoom: 19,
      }),
      visible: false,
    })

    // Buildings layer (Humanitarian OSM)
    const buildingsLayer = new TileLayer({
      source: new XYZ({
        url: "https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        attributions: "© OpenStreetMap contributors, Humanitarian OpenStreetMap Team",
        maxZoom: 19,
      }),
      visible: false,
    })

    // Create vector source and layer for markers
    const markersSource = new VectorSource()
    const markersLayer = new VectorLayer({
      source: markersSource,
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
    markersLayerRef.current = markersLayer

    // Create the map
    const map = new Map({
      target: mapContainerRef.current,
      layers: [osmLayer, satelliteLayer, buildingsLayer, markersLayer],
      view: new View({
        center: fromLonLat([companyLocation.lng, companyLocation.lat]),
        zoom: 14,
      }),
      controls: [],
    })

    // Create company marker element
    const companyMarkerElement = document.createElement("div")
    companyMarkerElement.className = "custom-company-marker"
    companyMarkerElement.innerHTML = `
      <div class="relative">
        <div class="h-6 w-6 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
          HG
        </div>
      </div>
    `

    // Create company marker overlay
    const companyMarkerOverlay = new Overlay({
      element: companyMarkerElement,
      positioning: "center-center",
      stopEvent: false,
    })
    map.addOverlay(companyMarkerOverlay)
    companyMarkerOverlay.setPosition(fromLonLat([companyLocation.lng, companyLocation.lat]))
    companyMarkerRef.current = companyMarkerOverlay

    // Add CSS for custom company marker
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

    // Add click handler for map
    map.on("click", (evt) => {
      const coordinate = evt.coordinate
      const lonLat = toLonLat(coordinate)

      // Calculate distance
      const distance = calculateDistance(lonLat[1], lonLat[0], companyLocation.lat, companyLocation.lng)

      // Add or update selected marker
      addOrUpdateSelectedMarker(lonLat[1], lonLat[0])

      // Reverse geocode to get location name and zip code
      reverseGeocode(lonLat[1], lonLat[0]).then(({ name, zipCode }) => {
        const newLocation = {
          name: name || "Selected Location",
          lat: lonLat[1],
          lng: lonLat[0],
          distance: Math.round(distance * 10) / 10,
          price: 0, // Price will be calculated in parent component
          id: `loc-${Math.random().toString(36).substr(2, 9)}`,
          zipCode,
        }

        setSelectedMapLocation(newLocation)
      })
    })

    // Add markers for saved locations
    addMarkersForLocations(savedLocationsList)

    // If there's a selected location, show it
    if (selectedMapLocation) {
      addOrUpdateSelectedMarker(selectedMapLocation.lat, selectedMapLocation.lng, true)
      map.getView().setCenter(fromLonLat([selectedMapLocation.lng, selectedMapLocation.lat]))
    }

    mapRef.current = map
    setIsMapInitialized(true)

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined)
        mapRef.current = null
      }
      document.head.removeChild(style)
    }
  }, [])

  // Update when selected location changes
  useEffect(() => {
    if (!isMapInitialized || !mapRef.current) return

    if (selectedMapLocation) {
      addOrUpdateSelectedMarker(selectedMapLocation.lat, selectedMapLocation.lng, true)
      mapRef.current.getView().setCenter(fromLonLat([selectedMapLocation.lng, selectedMapLocation.lat]))
    }
  }, [selectedMapLocation, isMapInitialized])

  // Update markers when saved locations change
  useEffect(() => {
    if (isMapInitialized && markersLayerRef.current) {
      addMarkersForLocations(savedLocationsList)
    }
  }, [savedLocationsList, isMapInitialized])

  // Add or update selected marker
  const addOrUpdateSelectedMarker = (lat: number, lng: number, isSelected = true) => {
    if (!markersLayerRef.current) return

    // Remove previous selected marker if it exists
    if (selectedMarkerRef.current) {
      markersLayerRef.current.getSource()?.removeFeature(selectedMarkerRef.current)
      selectedMarkerRef.current = null
    }

    // Create new marker
    const marker = new Feature({
      geometry: new Point(fromLonLat([lng, lat])),
      selected: isSelected,
      id: "selected-marker",
    })

    markersLayerRef.current.getSource()?.addFeature(marker)
    selectedMarkerRef.current = marker
  }

  // Add markers for saved locations
  const addMarkersForLocations = (locations: Location[]) => {
    if (!markersLayerRef.current) return

    // Clear existing markers except selected marker
    const source = markersLayerRef.current.getSource()
    const features = source?.getFeatures() || []

    for (const feature of features) {
      if (feature.get("id") !== "selected-marker") {
        source?.removeFeature(feature)
      }
    }

    // Add new markers
    locations.forEach((location) => {
      // Skip if this is the selected location
      if (selectedMapLocation && location.id === selectedMapLocation.id) return

      const marker = new Feature({
        geometry: new Point(fromLonLat([location.lng, location.lat])),
        selected: false,
        location: location,
        id: location.id,
      })

      markersLayerRef.current?.getSource()?.addFeature(marker)
    })

    // Add click handler for markers
    if (mapRef.current) {
      mapRef.current.on("click", (evt) => {
        const feature = mapRef.current?.forEachFeatureAtPixel(evt.pixel, (feature) => feature)

        if (feature && feature.get("location")) {
          const location = feature.get("location")
          selectLocationItem(location)
        }
      })
    }
  }

  // Change map layer type
  const changeMapLayer = (layerType: string) => {
    if (!mapRef.current) return

    setMapLayers(layerType)

    const layers = mapRef.current.getLayers().getArray()
    const osmLayer = layers[0]
    const satelliteLayer = layers[1]
    const buildingsLayer = layers[2]

    osmLayer.setVisible(layerType === "standard")
    satelliteLayer.setVisible(layerType === "satellite")
    buildingsLayer.setVisible(layerType === "buildings")
  }

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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return distance
  }

  const handleSearchInput = (query: string) => {
    setSearchQuery(query)
    setNotFound(false)

    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    // Instead of searching character by character, we'll search by words
    const words = query
      .trim()
      .split(" ")
      .filter((word) => word.length > 0)
    if (words.length > 0) {
      fetchSuggestions(words.join(" "))
    }
  }

  // Updated function to search by word by word
  const fetchSuggestions = async (query: string) => {
    if (query.trim().length < 2) return

    try {
      setIsSearching(true)

      // Use the complete query string for the search
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

          // Extract zip code from address data if available
          let zipCode = ""
          if (item.address && item.address.postcode) {
            zipCode = item.address.postcode
          }

          return {
            name: item.display_name,
            lat: Number.parseFloat(item.lat),
            lng: Number.parseFloat(item.lon),
            distance: distance,
            price: 0, // Price will be calculated by parent component
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

        // Extract zip code if available
        let zipCode = ""
        if (item.address && item.address.postcode) {
          zipCode = item.address.postcode
        }

        return {
          name: item.display_name,
          lat: Number.parseFloat(item.lat),
          lng: Number.parseFloat(item.lon),
          distance: distance,
          price: 0, // Price will be calculated by parent component
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

  const selectLocationItem = (location: Location) => {
    setSelectedMapLocation(location)

    if (mapRef.current) {
      mapRef.current.getView().setCenter(fromLonLat([location.lng, location.lat]))
      addOrUpdateSelectedMarker(location.lat, location.lng, true)
    }
  }

  const confirmSelection = () => {
    if (selectedMapLocation) {
      onSelectLocation(selectedMapLocation)
      onClose()
    }
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<{ name: string; zipCode: string }> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()

      let name = "Unknown location"
      let zipCode = ""

      if (data && data.display_name) {
        const parts = data.display_name.split(",")
        name = parts.slice(0, 3).join(", ")

        // Extract zip code from address details
        if (data.address) {
          zipCode = data.address.postcode || ""

          // If no postcode found, try to extract from display name
          if (!zipCode) {
            // Look for a pattern that looks like a zip/postal code in the address parts
            const postalCodePattern = /\b\d{5,6}\b/
            for (const part of parts) {
              const trimmedPart = part.trim()
              const match = trimmedPart.match(postalCodePattern)
              if (match) {
                zipCode = match[0]
                break
              }
            }
          }
        }
      }

      return { name, zipCode }
    } catch (error) {
      console.error("Error reverse geocoding:", error)
      return { name: "Unknown location", zipCode: "" }
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
                    // Use setTimeout to allow click events on suggestions to fire first
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
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${mapLayers === "standard"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <CloudOff className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => changeMapLayer("satellite")}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${mapLayers === "satellite"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <Cloud className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => changeMapLayer("buildings")}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${mapLayers === "buildings"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <Building className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Only show error when there are no suggestions AND notFound is true */}
              {notFound && suggestions.length === 0 && searchQuery.trim().length > 0 && (
                <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm">
                  Location not found. Please try a different search.
                </div>
              )}

              {/* Show suggestions when they exist */}
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
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedMapLocation && selectedMapLocation.id === location.id ? "bg-blue-50" : ""
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

              {/* Map type controls */}

              {/* Zoom controls */}
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
            className={`w-full py-2 rounded-md transition-colors font-medium ${selectedMapLocation
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  )
}