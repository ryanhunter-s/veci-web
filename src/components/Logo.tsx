export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role="img"
      aria-label="Veci"
    >
      <defs>
        <linearGradient id="veciBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#veciBg)" />
      <path d="M32 18 L13 35 L21 35 L21 49 L43 49 L43 35 L51 35 Z" fill="#FFFFFF" />
      <path
        transform="translate(25.28 36.12) scale(0.42)"
        d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
        fill="#FBBF24"
      />
    </svg>
  );
}

export function FullLogo({ color = "#20B981"}: { color?: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 860 420" version="1.1">
      <g transform="matrix(1,0,0,1,45,35)">
        <g transform="matrix(1,0,0,1,-45,-35)">
          <path d="M175,0C78.35,0 0,78.35 0,175C0,294.2 175,420 175,420C175,420 350,294.2 350,175C350,78.35 271.65,0 175,0Z" fill={color}/>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,45,35)">
        <g transform="matrix(1,0,0,1,-45,-40)">
          <path d="M78,168L175,82L272,168L272,273C272,282.94 263.94,291 254,291L96,291C86.06,291 78,282.94 78,273L78,168Z" fill="#fff"/>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,45,35)">
        <g transform="matrix(1,0,0,1,-45,-35)">
          <path d="M62,171L175,70L288,171C295.2,177.45 295.82,188.51 289.37,195.71C282.92,202.91 271.86,203.53 264.66,197.08L175,112L85.37,197.08C78.17,203.53 67.11,202.91 60.66,195.71C54.21,188.51 54.83,177.45 62.03,171L62,171Z" fill="#fff"/>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,45,35)">
        <g transform="matrix(0.901301,0,0,0.901301,-28.877107,-14.094337)">
          <circle cx="137" cy="200" r="31" fill={color}/>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,45,35)">
        <g transform="matrix(0.901301,0,0,0.901301,-28.877107,-14.094337)">
          <circle cx="216" cy="200" r="31" fill={color}/>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,45,35)">
        <g transform="matrix(0.901301,0,0,0.901301,-28.877107,-14.094337)">
          <path d="M90,278C90,247.07 111.04,222 137,222C162.96,222 184,247.07 184,278L184,300L90,300L90,278Z" fill={color}/>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,45,35)">
        <g transform="matrix(0.901301,0,0,0.901301,-28.877107,-14.094337)">
          <path d="M169,278C169,247.07 190.04,222 216,222C241.96,222 263,247.07 263,278L263,300L169,300L169,278Z" fill={color}/>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,430,75)">
        <g transform="matrix(1.077165,0,0,1.077165,-31.884152,221.919251)">
          <g transform="matrix(229.30573,0,0,229.30573,360.804989,0)"></g>
          <text x="-21.448px" y="0px" fontFamily="Nunito-Black, Nunito" fontWeight="900" fontSize="229.306px">V<tspan x="125.767px 230.101px 249.821px " y="0px 0px 0px ">e c</tspan></text>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,430,75)">
        <g transform="matrix(1,0,0,1,56.062489,1.062508)">
          <path d="M373,124L373,191C373,207.006 360.006,220 344,220C327.994,220 315,207.006 315,191L315,124C315,107.994 327.994,95 344,95C360.006,95 373,107.994 373,124Z"/>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,430,75)">
        <g transform="matrix(1,0,0,1,56.062489,4.062508)">
          <circle cx="343" cy="55" r="29" fill={color}/>
        </g>
      </g>
    </svg>
  );
}

export function IconLogo({ color = "#20B981" }: { color?: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 350 420" version="1.1">
      <g transform="matrix(1,0,0,1,45,35)">
        <g transform="matrix(1,0,0,1,-45,-35)">
          <path d="M175,0C78.35,0 0,78.35 0,175C0,294.2 175,420 175,420C175,420 350,294.2 350,175C350,78.35 271.65,0 175,0Z" fill={color}/>
        </g>
        <g transform="matrix(1,0,0,1,-45,-38)">
          <path d="M78,168L175,82L272,168L272,273C272,282.94 263.94,291 254,291L96,291C86.06,291 78,282.94 78,273L78,168Z" fill="#fff"/>
        </g>
        <g transform="matrix(1,0,0,1,-45,-35)">
          <path d="M62,171L175,70L288,171C295.2,177.45 295.82,188.51 289.37,195.71C282.92,202.91 271.86,203.53 264.66,197.08L175,112L85.37,197.08C78.17,203.53 67.11,202.91 60.66,195.71C54.21,188.51 54.83,177.45 62.03,171L62,171Z" fill="#fff"/>
        </g>
        <g transform="matrix(0.901301,0,0,0.901301,-28.877107,-14.094337)">
          <circle cx="137" cy="200" r="31" fill={color}/>
        </g>
        <g transform="matrix(0.901301,0,0,0.901301,-28.877107,-14.094337)">
          <circle cx="216" cy="200" r="31" fill={color}/>
        </g>
        <g transform="matrix(0.901301,0,0,0.901301,-28.877107,-14.094337)">
          <path d="M90,278C90,247.07 111.04,222 137,222C162.96,222 184,247.07 184,278L184,300L90,300L90,278Z" fill={color}/>
        </g>
        <g transform="matrix(0.901301,0,0,0.901301,-28.877107,-14.094337)">
          <path d="M169,278C169,247.07 190.04,222 216,222C241.96,222 263,247.07 263,278L263,300L169,300L169,278Z"  fill={color}/>
        </g>
      </g>
    </svg>
  );
}

export function TextIcon({ color = "#20B981" }: { color?: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 497 203" version="1.1">
      <g transform="matrix(1,0,0,1,60,-26)">
        <g transform="matrix(1.077165,0,0,1.077165,-31.884152,221.919251)">
          <g transform="matrix(229.30573,0,0,229.30573,360.804989,0)"></g>
          <text
            x="-21.448px"
            y="0px"
            font-family="Nunito-Black, Nunito"
            font-weight="900"
            font-size="229.306px"
          >V<tspan x="125.767px 230.101px 249.821px " y="0px 0px 0px ">e c</tspan></text>
        </g>
        <g transform="matrix(1,0,0,1,56.062489,1.062508)">
          <path d="M373,124L373,191C373,207.006 360.006,220 344,220C327.994,220 315,207.006 315,191L315,124C315,107.994 327.994,95 344,95C360.006,95 373,107.994 373,124Z"/>
        </g>
        <g transform="matrix(1,0,0,1,56.062489,4.062508)">
          <circle cx="343" cy="55" r="29" fill={color}/>
        </g>
      </g>
    </svg>
  );
}

export default function Logo({
  withWordmark = true,
  markClassName = "h-8 w-8",
  className = "",
}: {
  withWordmark?: boolean;
  markClassName?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={markClassName} />
      {withWordmark && (
        <span className="text-[22px] font-extrabold leading-none tracking-tighter text-foreground">
          vec<span className="text-accent">i</span>
        </span>
      )}
    </span>
  );
}