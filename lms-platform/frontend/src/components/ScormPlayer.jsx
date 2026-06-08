import React, { useEffect, useRef, useState } from 'react';

function ScormPlayer({ contentUrl, onComplete }) {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SCORM 1.2 API Implementation (Minimal Mock for PoC)
    window.API = {
      LMSInitialize: function(param) {
        console.log('SCORM: LMSInitialize', param);
        return "true";
      },
      LMSGetValue: function(element) {
        console.log('SCORM: LMSGetValue', element);
        return "";
      },
      LMSSetValue: function(element, value) {
        console.log(`SCORM: LMSSetValue ${element} = ${value}`);
        if (element === "cmi.core.lesson_status" && (value === "completed" || value === "passed")) {
          onComplete();
        }
        return "true";
      },
      LMSCommit: function(param) {
        console.log('SCORM: LMSCommit', param);
        return "true";
      },
      LMSFinish: function(param) {
        console.log('SCORM: LMSFinish', param);
        return "true";
      },
      LMSGetLastError: function() { return "0"; },
      LMSGetErrorString: function() { return "No error"; },
      LMSGetDiagnostic: function() { return "No error"; }
    };

    return () => {
      // Cleanup SCORM API from global scope on unmount
      delete window.API;
    };
  }, [onComplete]);

  return (
    <div className="w-full h-[600px] border bg-gray-100 flex flex-col">
      {loading && <div className="p-4 text-center text-gray-500">Loading SCORM Module...</div>}
      <iframe
        ref={iframeRef}
        src={contentUrl}
        className="w-full h-full border-none"
        onLoad={() => setLoading(false)}
        title="SCORM Player"
      />
    </div>
  );
}

export default ScormPlayer;
