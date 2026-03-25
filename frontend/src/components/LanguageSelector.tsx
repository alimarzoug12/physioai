// src/components/LanguageSelector.tsx
import React from 'react';

//page 1.3 src/components/LanguageSelector.tsx
class LanguageSelector extends React.Component {
  render() {
    return (
      <div className=" bg-gray-50 flex flex-col items-center justify-center md:p-10">
        {/* Titre principal */}
        <h1 className="text-3xl md:text-2xl font-semibold text-gray-900 mb-12 text-center">
          Choose Your Language
        </h1>

        {/* Conteneur des deux cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Carte Anglais (GB) - Default */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                GB
              </h2>
              <p className="text-xl text-gray-700 mb-3">
                English
              </p>
              <span className="text-sm text-gray-500">
                Default
              </span>
            </div>
          </div>

          {/* Carte Arabe (QA) */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-center text-center">              
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                QA
              </h2>
              <p className="text-xl text-gray-700 mb-3">
                العربية
              </p>
              <p className="text-sm text-gray-500">
                Arabic
              </p>
            </div>
          </div>
        </div>    
      </div>
    );
  }
}

export default LanguageSelector;