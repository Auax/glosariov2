import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Moon, Sun, Book, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ModernGrammarGlossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [grammarTerms, setGrammarTerms] = useState([]);
  const [categories, setCategories] = useState(["Todos"]);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        setGrammarTerms(data);
        const uniqueCategories = [
          "Todos",
          ...new Set(data.map((term) => term.type)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const filteredTerms = grammarTerms.filter(
    (term) =>
      term.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "Todos" || term.type === selectedCategory),
  );

  return (
    <div
      className={`min-h-screen flex flex-col ${isDarkMode ? "dark bg-gray-900" : "bg-gray-100"} transition-colors duration-300 font-sans`}
    >
      <header className="bg-blue-700 text-white p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <Book className="mr-2" />
            Glosario de Términos Gramaticales
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-blue-600 transition-colors"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6 flex-grow">
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Página hecha por Ibai Farina. Muchos de los términos son de Hector
          Berger
        </p>

        <div className="mb-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar por nombre"
              className="w-full p-3 pl-10 border rounded-md shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={20}
            />
          </div>
          <select
            className="p-3 border rounded-md shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <AnimatePresence>
            {filteredTerms.map((term) => (
              <motion.div
                key={term.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTerm(term)}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {term.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {term.type}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTerms.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-300">
            <Info size={48} className="mx-auto mb-4" />
            <p>
              No se encontraron términos. Intente con una búsqueda diferente.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-gray-200 dark:bg-gray-800 p-4 mt-auto">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-300">
          <p>
            © 2024 Glosario de Términos Gramaticales. Todos los derechos
            reservados.
          </p>
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Donar
          </button>
        </div>
      </footer>

      <AnimatePresence>
        {selectedTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTerm(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-2 dark:text-white">
                {selectedTerm.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedTerm.type}
              </p>
              <div className="prose dark:prose-invert">
                <ReactMarkdown>{selectedTerm.description}</ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernGrammarGlossary;
