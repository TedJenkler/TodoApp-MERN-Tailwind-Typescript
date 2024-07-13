function EmptyCol() {
  return (
    <main className="bg-darkbg h-screen flex flex-col items-center justify-center overflow-hidden px-10">
        <h1 className="hl text-center text-mediumgrey mb-6">This board is empty. Create a new column to get started.</h1>
        <button className="bg-mainpurple h-12 w-[10.875rem] rounded-3xl text-white hm">+ Add New Column</button>
    </main>
  )
}

export default EmptyCol
