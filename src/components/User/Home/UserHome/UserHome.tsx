
import "./UserHome.css";

export default function UserHome() {



  return (
    <div className="user-home">
      <nav className="navbar">
        <input type="text" placeholder="Search..." className="search-bar" />
        <div className="navbar-content">
          <div className="nav-links">
            <span className="nav-item home">Home</span>
            <span className="nav-item courses">Courses</span>
          </div>
          <div className="nav-icons">
            <div className="nav-icon people"></div>
            <div className="nav-icon account"></div>
          </div>
        </div>
      </nav>
      <div className="container-16">
        <div className="container-18">
          <div className="discoverthe-professions-of-the-future">
            Discover
            <br />
            the professions
            <br />
            of the future
          </div>
          <div className="lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit-phasellus-imperdiet-nulla-et-dictum-interdum-nisi-lorem-egestas-odio-vitae-scelerisque-enim-ligula-venenatis-dolor-maecenas-nisl-est-ultrices-nec-congue-eget-auctor-vitae-massa">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            <br />
            Phasellus imperdiet, nulla et dictum interdum, <br />
            nisi lorem egestas odio, vitae scelerisque enim ligula venenatis
            dolor.
            <br />
            Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.
          </div>
          <button className="get-started">Get Started</button>
        </div>
        <div className="user-home-1"></div>
      </div>
      <div className="top-courses">
        <div className="featured-courses">Featured Courses</div>
        <div className="cards">
          <div className="card">
            <img src="" className="card-image" />
            <h3 className="card-title">title</h3>
            <p className="card-description">lorepsjhsjsjnaj hy how are you </p>
            <p className="card-amount">Rs. 235</p>
          </div>
          <div className="card">
            <img src="" className="card-image" />
            <h3 className="card-title">title</h3>
            <p className="card-description">lorepsjhsjsjnaj hy how are you </p>
            <p className="card-amount">Rs. 235</p>
          </div>
          <div className="card">
            <img src="" className="card-image" />
            <h3 className="card-title">title</h3>
            <p className="card-description">lorepsjhsjsjnaj hy how are you </p>
            <p className="card-amount">Rs. 235</p>
          </div>
          <div className="card">
            <img src="" className="card-image" />
            <h3 className="card-title">title</h3>
            <p className="card-description">lorepsjhsjsjnaj hy how are you </p>
            <p className="card-amount">Rs. 235</p>
          </div>
        </div>
      </div>
      <div className="container-12">
        <div className="rectangle-251"></div>
        <div className="container-22">
          <div className="about-us">About Us</div>
          <div className="lorem-ipsum-has-been-the-industrys-standard-dummy-text-ever-since-the-1500-swhen-an-unknown-printer-took-agalley-of-type-and-scrambled-it-to-make-atype-specimen-book-versions-of-the-lorem-ipsum-text-have-been-used-in-typesetting-at-least-since-the-1960-swhen-it-was-popularized-by-advertisements-for-letraset-transfer-sheets-lorem-ipsum-was-introduced-to-templates-for-its-desktop-publishing-program-page-maker-as-have-many-la-te-xpackages-web-content-managers-such-as-joomla-and-word-press-and-css-libraries">
            <br />
            Lorem Ipsum has been the industry&#39;s standard dummy text
            <br />
            ever since the 1500s,when an unknown printer took a galley
            <br />
            of type and scrambled it to make a type specimen book. <br />
            Versions of the Lorem ipsum text have been used in typesetting
            <br />
            at least since the 1960s,when it was popularized by advertisements
            for <br />
            Letraset transfer sheets. Lorem ipsum was introduced to templates
            for its desktop
            <br />
            publishing program PageMaker. as have many LaTeX
            <br />
            packages, web content managers such as Joomla! and WordPress, and
            CSS libraries.
          </div>
          <div className="container-21">
            <span className="get-started-1">Get Started</span>
          </div>
        </div>
      </div>
      <div className="footer">
      <div className="footer-links">
  <div className="footer-category">
    <span className="category-title">COMPANY</span>
    <ul className="subtopics">
      <li>About</li>
      <li>Careers</li>
      <li>Press</li>
    </ul>
  </div>
  <div className="footer-category">
    <span className="category-title">HELP CENTER</span>
    <ul className="subtopics">
      <li>Support</li>
      <li>FAQs</li>
      <li>Contact</li>
    </ul>
  </div>
  <div className="footer-category">
    <span className="category-title">RESOURCES</span>
    <ul className="subtopics">
      <li>Blog</li>
      <li>Guides</li>
      <li>Webinars</li>
    </ul>
  </div>
  <div className="footer-category">
    <span className="category-title">PRODUCTS</span>
    <ul className="subtopics">
      <li>Features</li>
      <li>Pricing</li>
      <li>Reviews</li>
    </ul>
  </div>
</div>


      </div>
    </div>
  );
}
