const DialogBox = () => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="h-40 w-64 bg-blue-500 rounded-lg flex justify-center items-center">
          <h1 className="text-white text-center">Data Submittd Successfully</h1>
        </div>
      </div>
    </>
  );
};

export default DialogBox;
