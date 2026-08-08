Pod::Spec.new do |s|
  s.name           = 'BannerWindow'
  s.version        = '1.0.0'
  s.summary        = 'QA fixture: a deliberately non-fullscreen UIWindow (banner-SDK simulation)'
  s.description    = 'Creates a small floating UIWindow, the way in-app-banner SDKs do, to exercise how react-native-one-hand treats windows that are not screen-sized.'
  s.license        = 'MIT'
  s.author         = 'react-native-one-hand example'
  s.homepage       = 'https://example.invalid/banner-window'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = '**/*.{h,m,mm,swift}'
end
