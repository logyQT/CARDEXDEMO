const exportToJSON = (saveData) => {
   if (!saveData) {
       console.error("No save data found.");
       return;
   }

   saveData = JSON.stringify(saveData);
   const blob = new Blob([saveData], { type: "application/json" });
   const url = URL.createObjectURL(blob);

   const a = document.createElement("a");
   a.href = url;
   a.download = "saveData.json";
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   URL.revokeObjectURL(url);
};

const importFromJSON = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (typeof callback === "function") {
                callback(data);
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    };
    reader.readAsText(file);
};
export { exportToJSON, importFromJSON };