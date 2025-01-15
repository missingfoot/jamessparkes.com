// CVModal.js
export function CVModal() {
    return `
        <div id="cvModal" class="fixed inset-0 z-[1001] hidden">
                <div id="cvModalBackground" class="absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300"></div>
                <div id="cvModalContent" class="absolute inset-x-0 bottom-0 bg-primary-light dark:bg-primary-dark rounded-t-xl transform translate-y-full transition-all duration-300 h-[80vh] flex flex-col">
                    <!-- Puller (only for mobile) -->
                    <div class="flex justify-center pt-4 pb-6 cursor-grab active:cursor-grabbing">
                        <div class="w-10 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"></div>
                    </div>
                    <!-- CV content -->
                    <div id="cvContent" class="flex-grow overflow-y-auto p-4 sm:p-10 text-gray-800 dark:text-gray-200">
                        <h3 class="text-xl font-bold mb-4">Experience</h3>
                        
                        <div class="mb-6 flex">
                            <div class="w-1/4 pr-4 text-xs pt-1">
                                <p>02.22&ndash;Present</p>
                                <p>2 yrs 8 mos</p>
                            </div>
                            <div class="w-3/4">
                                <h4 class="font-bold">FIXR</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Senior UX/UI Designer</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Full-time</p>
                                <p class="text-sm">Product design of FIXR's ticket buying and management platforms for web, iOS, and Android.</p>
                            </div>
                        </div>

                        <div class="mb-6 flex">
                            <div class="w-1/4 pr-4 text-xs pt-1">
                                <p>07.21&ndash;02.22</p>
                                <p>8 mos</p>
                            </div>
                            <div class="w-3/4">
                                <h4 class="font-bold">AMBIO-N (CircularSource)</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Graphic Designer</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Contract</p>
                                <p class="text-sm">UX / UI designer for B2B ecommerce website and analytics dashboard</p>
                            </div>
                        </div>

                        <div class="mb-6 flex">
                            <div class="w-1/4 pr-4 text-xs pt-1">
                                <p>01.21&ndash;07.21</p>
                                <p>7 mos</p>
                            </div>
                            <div class="w-3/4">
                                <h4 class="font-bold">Kuula TV</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Product Designer</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Contract</p>
                                <p class="text-sm">UI / UX designer for a yoga instructor website, management platform, and client microsites.</p>
                                <p class="text-sm">Design of a media file backend platform for instructors.</p>
                            </div>
                        </div>

                        <div class="mb-6 flex">
                            <div class="w-1/4 pr-4 text-xs pt-1">
                                <p>07.17&ndash;06.20</p>
                                <p>3 yrs</p>
                            </div>
                            <div class="w-3/4">
                                <h4 class="font-bold">The Collective</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Lead UX/UI Designer</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Full-time</p>
                                <p class="text-sm">Lead UX / UI designer for multiple in-house mobile and web apps including property and finance management systems, social media apps, and CRM platform</p>
                            </div>
                        </div>

                        <div class="mb-6 flex">
                            <div class="w-1/4 pr-4 text-xs pt-1">
                                <p>05.16&ndash;06.16</p>
                                <p>2 mos</p>
                            </div>
                            <div class="w-3/4">
                                <h4 class="font-bold">Maxus</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">UX/UI Designer</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Contract</p>
                                <p class="text-sm">UX and UI Design and QA of data analytics platform for L'Oréal brands</p>
                                <p class="text-sm">Design of a data analytics platform for BT</p>
                            </div>
                        </div>

                        <div class="mb-6 flex">
                            <div class="w-1/4 pr-4 text-xs pt-1">
                                <p>02.16&ndash;05.16</p>
                                <p>4 mos</p>
                            </div>
                            <div class="w-3/4">
                                <h4 class="font-bold">TMW Unlimited</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">UX/UI Designer</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Contract</p>
                                <p class="text-sm">UX / UI website design and artworking for Sony Mobile</p>
                                <p class="text-sm">Print design and campaign work for Infinit, Canon, and HSBC</p>
                            </div>
                        </div>

                        <div class="mb-6 flex">
                            <div class="w-1/4 pr-4 text-xs pt-1">
                                <p>03.15&ndash;02.16</p>
                                <p>1 yr</p>
                            </div>
                            <div class="w-3/4">
                                <h4 class="font-bold">Breezie</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">UX/UI Designer</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Full-time</p>
                                <p class="text-sm">UX / UI design for Android-based operating system targeted towards elderly and disabled</p>
                                <p class="text-sm">UX / UI design for Samsung SmartThings dashboard</p>
                                <p class="text-sm">Design research and user testing</p>
                            </div>
                        </div>

                        <div class="mb-6 flex">
                            <div class="w-1/4 pr-4 text-xs pt-1">
                                <p>03.14&ndash;03.15</p>
                                <p>1 yr 1 mo</p>
                            </div>
                            <div class="w-3/4">
                                <h4 class="font-bold">Fabric Worldwide</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">UX/UI Designer</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Full-time</p>
                                <p class="text-sm">UX / UI design for a marketing data analytics platform</p>
                                <p class="text-sm">Client website design, artworking, photo editing for Heineken and KFC</p>
                            </div>
                        </div>

                        <div class="mb-6 flex">
                            <div class="w-1/4 pr-4 text-xs pt-1">
                                <p>03.09&ndash;02.14</p>
                                <p>5 yrs</p>
                            </div>
                            <div class="w-3/4">
                                <h4 class="font-bold">QD Design</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Designer & Developer</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Full-time</p>
                                <p class="text-sm">Design and development of an ecommerce platform, database, and warehouse management software</p>
                                <p class="text-sm">Digital and print design for rebrand and brand development</p>
                                <p class="text-sm">Design, layout for advertising, and promotional materials</p>
                                <p class="text-sm">Product photography, photo retouching of products</p>
                                <p class="text-sm">3D CAD product design</p>
                            </div>
                        </div>

                        <h3 class="text-xl font-bold mb-4 mt-8">Education</h3>

                        <div class="mb-6 flex">
                            <div class="w-1/4 pr-4 text-xs pt-1">
                                <p>09.10&ndash;06.13</p>
                                <p>3 yrs</p>
                            </div>
                            <div class="w-3/4">
                                <h4 class="font-bold">Canterbury Christ Church University</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Bachelor of Arts (B.A.), Graphic Design</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Grade: 1st Class Honours</p>
                                <p class="text-sm">1st Class B.A. Honours in Graphic Design, focusing on digital design, with projects including:</p>
                                <p class="text-sm"><span class="font-bold">Major Project:</span> brand development, research, advertising material, promotional material, and packaging</p>
                                <p class="text-sm"><span class="font-bold">Graphic Design:</span> Worked as part of a team to create an art book</p>
                                <p class="text-sm"><span class="font-bold">Digital Image Manipulation:</span> Artworking, high-end photo retouching, digital compositing, matte painting</p>
                                <p class="text-sm"><span class="font-bold">Web design:</span> research, UX, visual design, and development of static websites</p>
                                <p class="text-sm"><span class="font-bold">3D design:</span> modelling, scene building, animation, rigging, lighting, procedural object building</p>
                            </div>
                        </div>

                        <!-- Download CV and Close links -->
                        <div class="mt-8 pb-8 flex flex-col items-center gap-8">
                            <a href="https://jamessparkes.s3.eu-west-1.amazonaws.com/James_Sparkes_CV.pdf" target="_blank" rel="noopener noreferrer" class="inline-block text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition duration-300 cursor-pointer">
                                Download CV
                            </a>
                            <a href="#" id="closeModalButton" class="sm:hidden inline-block text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition duration-300 cursor-pointer">
                                Close
                            </a>
                        </div>
                    </div> <!-- Close of #cvContent -->
                </div>
            </div>
    `;
} 