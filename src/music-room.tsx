"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Volume2, VolumeX, Search, Users, Music, Plus } from "lucide-react";
import { Slider } from "./components/Slider/slider";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

export default function MusicRoom() {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ");
  const [ready, setReady] = useState(false);
  const [volume, setVolume] = useState(33);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(33);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [title, setTitle] = useState("No song playing");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  async function handleSearch() {
    const res = await fetch(`/api/search?q=${searchQuery}`);
    const data = await res.json();
    console.log(data.items, "items");
    //video Id
    const item = data.items[0];
    const videoId = item.id.videoId;
    setVideoId(videoId);
    setTitle(item.snippet.title);

    // setResults(data.items);
    playerRef.current.loadVideoById(videoId);
    setSearchQuery("");
  }

  useEffect(() => {
    function loadPlayer() {
      playerRef.current = new window.YT.Player("yt-player", {
        height: "0",
        width: "0",
        // videoId,
        playerVars: {
          playsinline: 1,
        },
        events: {
          onReady: () => setReady(true),
        },
      });
    }

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        loadPlayer();
      };
    } else {
      loadPlayer();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  const changeVolume = (newVolume: number) => {
    if (newVolume < 0) newVolume = 0;
    if (newVolume > 100) newVolume = 100;
    setVolume(newVolume);
    if (isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      // Unmute
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      // Mute
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  useEffect(() => {
    console.log({ ready });
    if (ready) {
      playerRef.current.setVolume(volume);
      playerRef.current.playVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Atualiza o tempo a cada 500ms
  useEffect(() => {
    if (!ready) return;

    const interval = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();

        setCurrentTime(current);
        setDuration(total);

        if (total > 0) {
          setProgress((current / total) * 100);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [ready]);

  function formatTime(sec: number) {
    if (!sec || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  }

  const queueSongs = [
    { title: "Midnight Drive", artist: "Synthwave City", genre: "Synthwave" },
    { title: "Summer Breeze", artist: "Chill Collective", genre: "Chill" },
    { title: "Electric Pulse", artist: "Neon Lights", genre: "Electronic" },
  ];

  const connectedUsers = [
    { name: "MusicLover", avatar: "🎵" },
    { name: "BeatMaster", avatar: "🎧" },
    { name: "RhythmQ", avatar: "🎤" },
    { name: "Couto", avatar: "👨‍💻" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div id="yt-player"></div>
      {/* Header */}
      <header className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold">Radinho</h1>
        </div>

        <div className="flex items-center space-x-2 bg-slate-700 px-3 py-1 rounded-full">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="text-sm">5 Listeners Online</span>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Turntables */}
          <div className="flex justify-center items-center space-x-12 mb-8">
            {/* DJ Turntable */}
            <div className="text-center">
              <div className="w-48 h-48 bg-slate-700 rounded-full border-4 border-slate-600 flex items-center justify-center relative mb-4">
                <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-slate-900 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-2 h-8 bg-slate-400 rounded"></div>
              </div>
              <p className="font-medium">DJ Alex</p>
            </div>

            {/* Empty Turntable */}
            <div className="text-center">
              <div className="w-48 h-48 bg-slate-700 rounded-full border-4 border-dashed border-slate-600 flex items-center justify-center mb-4 hover:border-purple-400 transition-colors cursor-pointer">
                <div className="text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-slate-400 text-sm">Take DJ Spot</p>
                </div>
              </div>
            </div>
          </div>

          {/* Now Playing */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-purple-400" />
                <span className="font-medium">Now Playing</span>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMute}
                  className="hover:bg-slate-700"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-pink-500" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-slate-400" />
                  )}
                </Button>
                <div className="w-64 bg-slate-700 h-2 rounded-full">
                  <Slider
                    value={[volume]}
                    onValueChange={(val) => changeVolume(val[0])}
                    className="h-2 rounded-full transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">🔥</span>
                  <span className="text-sm">0</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-purple-400">⚡</span>
                  <span className="text-sm">0</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <h3 className="text-lg font-medium mb-1">{title}</h3>
              {/* <p className="text-slate-400 text-sm">Upload a song to start</p> */}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-sm text-slate-400">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 bg-slate-700 h-1 rounded-full">
                <div
                  className={`bg-purple-400 h-1 rounded-full transition-all duration-150`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-slate-400">
                {formatTime(duration)}
              </span>
            </div>

            {/* Connected Users */}
            <div className="flex justify-center space-x-4">
              {connectedUsers.map((user, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-1 text-lg">
                    {user.avatar}
                  </div>
                  <p className="text-xs text-slate-400">{user.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
          {/* Song Queue */}
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-medium mb-4">Song Queue</h3>
            <div className="space-y-3">
              {queueSongs.map((song, index) => (
                <div key={index} className="bg-slate-700 p-3 rounded-lg">
                  <p className="font-medium text-sm">{song.title}</p>
                  <p className="text-slate-400 text-xs">
                    {song.artist} • {song.genre}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search for songs, artists, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-sm"
              />
              <Button
                size="sm"
                className="bg-pink-500 hover:bg-pink-600"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-slate-400 text-xs mt-2 italic">
              Type to search for music...
            </p>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-medium">Chat</h3>
            </div>

            <div className="flex-1 p-4">
              <div className="text-slate-400 text-sm italic">
                Welcome to the room, Couto!
              </div>
            </div>

            <div className="p-4 border-t border-slate-700">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && chatMessage.trim()) {
                      // Handle send message
                      setChatMessage("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="bg-pink-500 hover:bg-pink-600"
                  onClick={() => {
                    if (chatMessage.trim()) {
                      // Handle send message
                      setChatMessage("");
                    }
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
